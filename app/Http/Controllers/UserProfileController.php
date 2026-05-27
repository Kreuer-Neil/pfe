<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function show($id)
    {
        return Inertia::render('profile/show');
    }
}
