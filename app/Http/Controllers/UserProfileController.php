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
        if (!($user->exists()
            /*&& ((!$user->is_private) || $user->hasProjectsInCommonWith(auth()->user()))*/
        )) {
            abort(404);
        }

        $user = new FormatedProfile($user);
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
            'avatar' => 'nullable|image|extensions:jpg,jpeg,png,gif,webp|max:2048'
        ]);

        if (array_key_exists('avatar', $validated)) {

            $oldAvatarName = $user->avatar;

            $path = $request
                ->file('avatar')
                ->store('images/users', 'public');

            // TODO refactor
            $avatarName = Str::beforeLast(Str::afterLast($path, '/'), '.');

            HandleProfileImageUploads::dispatch($avatarName, $oldAvatarName, $path, 'users');

            $user->avatar = $avatarName;
        }

        $user->nickname = $validated['nickname'];
        $user->pronouns = $validated['pronouns'] ?? null;
        $user->bio = $validated['bio'] ?? null;

        $user->save();

        Inertia::flash(['success' => true]);
        return redirect(route('user-profile.show', $id));
    }
}
