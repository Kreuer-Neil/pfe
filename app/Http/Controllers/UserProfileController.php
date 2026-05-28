<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function show($id)
    {
      $user = User::canFindUser($id, auth()->user());

      if (!$user) {
          abort(404);
      }

        auth()->user()->projects;
        return Inertia::render('profile/profile-show', compact('user'));
    }
}
