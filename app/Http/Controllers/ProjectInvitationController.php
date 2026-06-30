<?php

namespace App\Http\Controllers;

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\ProjectInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectInvitationController extends Controller
{
    function index()
    {
        return Inertia::render('projects/invitation');
    }

    function show(Request $request)
    {
        $slug = $request->project_slug;
        if (!$slug) {
            return back();
        }

        $project = Project::where('slug', $slug)->first();
        if (!$project->is_private) {
            // TODO change later?
            Inertia::flash(['invitation' => route('projects.show', $slug)]);
        } // Check if request has right attributes
        else {
            if (!($invitation = $project->invitations()
                ->where('expires_at', $request->expires_at ?? null)
                ->where('uses', $request->uses ?? null))
                ->exists()) {
                $invitation = $project->generateInvitation($request->expires_at ?? null, $request->uses ?? null);
            }

            Inertia::flash(['invitation' => route('projects.invitations', ['code' => $invitation->first()->code])]);
        }
        return redirect(route('projects.show', $slug));
    }


    /**
     * To use an invitation
     */
    function use(Request $request)
    {
        $validated = $request->validate([
            'code'=>'required|string|size:16',
            'confirm' => 'nullable|int'
        ]);
        $code = $validated['code'];
        $invitation = ProjectInvitation::where('code', $code)->first();
        if (!($invitation && $invitation->isValid())) {
            // TODO translations
            return redirect()->back()->withErrors(['code' => 'invalid code']);
        }

        if ($invitation->project()->first()->members()->find((auth()->user()->id))) {
            return redirect()->back()->withErrors(['code' => 'Already member']);
        }

        if (!array_key_exists('confirm',$validated)) {
            Inertia::flash([
                'error' => null,
                'confirm' => true,
                'code'=> $code,
            ]);

            return redirect()->back();
        }

        Member::create([
            'user_id' => auth()->user()->id,
            'project_id' => $invitation->project()->first()->id,
            'role' => ProjectRole::MEMBER,
        ]);

        Inertia::flash(['join_success' => true]);
        return redirect(route('projects.show', $invitation->project->slug));
    }
}
