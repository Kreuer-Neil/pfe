<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthPageController extends Controller
{
    function register()
    {
        inertia('welcome');
    }

    public function login()
    {
        inertia('welcome');
    }
}
