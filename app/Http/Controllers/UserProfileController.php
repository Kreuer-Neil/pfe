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
    public function show($id)
    {
        return $this->renderProfile($id, false);
    }

    public function edit($id)
    {
        return $this->renderProfile($id, true);
    }

    private function renderProfile($id, bool $editing)
    {
        $user = User::find($id);

        // TODO add check if not contact or project in common + if account private
        if (!($user
            /*&& ((!$user->is_private) || $user->hasProjectsInCommonWith(auth()->user()))*/
        )) {
            abort(404);
        }

        $canEdit = auth()->user()->id === $user->id;

        if ($editing && !$canEdit) {
            abort(403);
        }

        $user = (new ProfileResource($user))->toArray(request());

        return Inertia::render('profile/profile-show', compact(
            'user', 'canEdit', 'editing'
        ));
    }

    public function update(int $id, Request $request)
    {
        if (auth()->user()->id !== $id) {
            // TODO 404 if profile private?
            abort(403);
        }

        $user = User::find($id);

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

        return redirect(route('user-profile.show', $id));
    }


    // Other methods
    public function follow(int $id)
    {
        if (!User::find($id)) {
            abort(404);
        }

        $currentUser = auth()->user();
        if ($id !== $currentUser->id) {
            User::find($id)->followAs($currentUser);
        }

        return redirect(route('user-profile.show', $id));
    }

    public function unfollow(int $id)
    {
        if (!User::find($id)) {
            abort(404);
        }

        $currentUser = auth()->user();
        if ($id !== $currentUser->id) {
            User::find($id)->unfollowAs($currentUser);
        }

        return redirect(route('user-profile.show', $id));
    }
}
