<?php

namespace App\Http\Controllers;

use App\FormatedModels\FormatedProfile;
use App\FormatedModels\FormatedUser;
use App\Jobs\HandleProfileImageUploads;
use App\Models\User;
use File;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Format;
use Intervention\Image\ImageManager;

class UserProfileController extends Controller
{
    public function show($id)
    {
        $user = User::find($id);

        // TODO add check if not contact or project in common + if account private
        if (!($user
            /*&& ((!$user->is_private) || $user->hasProjectsInCommonWith(auth()->user()))*/
        )) {
            abort(404);
        }

        $user = $user->toFormatedProfile(auth()->user());
        auth()->user()->projects;
        return Inertia::render('profile/profile-show', compact('user'));
    }

    public function update(int $id, Request $request)
    {
        if (auth()->user()->id !== $id) {
            // TODO 404 if profile private?
            abort(403);
        }

        $user = User::find($id);

        $validated = $request->validate([
            'nickname' => 'required|string|min:3|max:32',
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

        $user->nickname = $validated['nickname'];
        $user->pronouns = $validated['pronouns'] ?? null;
        $user->bio = $validated['bio'] ?? null;

        $user->save();

        Inertia::flash(['success' => true]);
        return redirect(route('user-profile.show', $id));
    }


    // Other methods
    public function follow(int $id)
    {
        if (!User::find($id)) {
            abort(404);
        }

        $currentUser = auth()->user();
        if ($id === $currentUser->id) {
            Inertia::flash(['follow_success' => false]);
        } else {
            $user = User::find($id);

            Inertia::flash(['follow_success' => $user->followAs($currentUser)]);
        }

        return redirect(route('user-profile.show', $id));
    }

    public function unfollow(int $id)
    {
        if (!User::find($id)) {
            abort(404);
        }

        $currentUser = auth()->user();
        if ($id === $currentUser->id) {
            Inertia::flash(['follow_success' => false]);
        } else {
            $user = User::find($id);

            Inertia::flash(['follow_success' => $user->unfollowAs($currentUser)]);
        }

        return redirect(route('user-profile.show', $id));
    }
}
