<?php

namespace App\Http\Controllers;

use App\Http\Resources\User\ProfileResource;
use App\Jobs\HandleProfileImageUploads;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function show(User $user)
    {
        return $this->renderProfile($user, false);
    }

    public function edit(User $user)
    {
        return $this->renderProfile($user, true);
    }

    private function renderProfile(User $user, bool $editing)
    {
        // TODO add check if not contact or project in common + if account private
        /*if (!(($user->is_private) || $user->hasProjectsInCommonWith(auth()->user()))) {
            abort(404);
        }*/

        $canEdit = auth()->user()->id === $user->id;

        if ($editing && !$canEdit) {
            abort(403);
        }

        $user = (new ProfileResource($user))->toArray(request());

        return Inertia::render('profile/profile-show', compact(
            'user', 'canEdit', 'editing'
        ));
    }

    public function update(User $user, Request $request)
    {
        if (auth()->user()->id !== $user->id) {
            // TODO 404 if profile private?
            abort(403);
        }

        $validated = $request->validate([
            'nickname' => 'nullable|string|min:3|max:32',
            'pronouns' => 'nullable|string|max:24',
            'bio' => 'nullable|min:3|max:255',
            'avatar' => 'nullable|image|extensions:jpg,jpeg,png,gif,webp|max:2048|dimensions:max_width=2000,max_height=2000'
        ]);

        if (array_key_exists('avatar', $validated)) {

            $oldImageName = $user->avatar;

            $imagePath = $request
                ->file('avatar')
                ->store('images/users', 'public');

            // TODO refactor
            $imageName = Str::beforeLast(Str::afterLast($imagePath, '/'), '.');

            $directory = 'users';
            HandleProfileImageUploads::dispatch($imageName, $oldImageName, $imagePath, $directory);

            $user->avatar = $imageName;
        }

        $user->nickname = $validated['nickname'] ?? "$user->first_name $user->last_name";
        $user->pronouns = $validated['pronouns'] ?? null;
        $user->bio = $validated['bio'] ?? null;

        $user->save();

        return redirect(route('user-profile.show', $user));
    }


    // Other methods
    public function follow(User $user)
    {
        $currentUser = auth()->user();
        if ($user->id !== $currentUser->id) {
            $user->followAs($currentUser);
        }

        return redirect(route('user-profile.show', $user));
    }

    public function unfollow(User $user)
    {
        $currentUser = auth()->user();
        if ($user->id !== $currentUser->id) {
            $user->unfollowAs($currentUser);
        }

        return redirect(route('user-profile.show', $user));
    }
}
