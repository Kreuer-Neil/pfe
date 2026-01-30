<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        syncLangFiles(['nav','dashboard', 'project', 'misc']);
        return Inertia::render('dashboard');
    }
}
