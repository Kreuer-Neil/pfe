<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $projects = Project::all()->toArray();

        syncLangFiles(['nav', 'dashboard', 'project', 'misc']);
        return Inertia::render('dashboard', compact('projects'));
    }
}
