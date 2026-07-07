<?php

namespace App\Http\Controllers;

use App\Enums\ProjectRole;
use App\Models\Member;
use App\Models\Project;
use App\Models\ProjectInvitation;
use Gate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectInvitationController extends Controller
{
    function index(Request $request)
    {
        return Inertia::render('projects/invitation', [
            'code' => $request->input('code', ''),
        ]);
    }

    function show(Request $request)
    {
        $validated = $request->validate([
            'project_slug' => 'required|exists:projects,slug',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at_date' => 'nullable|date|after_or_equal:today|required_with:expires_at_time',
            'expires_at_time' => 'nullable|date_format:H:i',
        ]);

        $project = Project::where('slug', $validated['project_slug'])->firstOrFail();

        Gate::authorize('viewData', $project);

        $maxUses = $validated['max_uses'] ?? null;
        $expiresAt = !empty($validated['expires_at_date'])
            ? $validated['expires_at_date'] . ' ' . ($validated['expires_at_time'] ?? '00:00')
            : null;

        // Only generates for private projects since public ones generate the link themselves
        if ($project->is_private) {
            $invitation = $project->invitations()
                ->where('expires_at', $expiresAt)
                ->where('max_uses', $maxUses)
                ->where('used_count', 0)
                ->first();

            if (!$invitation) {
                $invitation = $project->generateInvitation($expiresAt, $maxUses);
            }

            Inertia::flash(['invitation' => route('projects.invitations', ['code' => $invitation->code])]);
        }
        return redirect(route('projects.show', $validated['project_slug']));
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
            return redirect()->back()->withErrors(['code' => __('validation.invitation_invalid_code')]);
        }

        if ($invitation->project()->first()->members()->find((auth()->user()->id))) {
            return redirect()->back()->withErrors(['code' => __('validation.invitation_already_member')]);
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

        $invitation->recordUse();

        Inertia::flash(['join_success' => true]);
        return redirect(route('projects.show', $invitation->project->slug));
    }

    function revoke(string $slug, string $invitationId)
    {
        $project = Project::where('slug', $slug)->firstOrFail();
        Gate::authorize('manageInvitations', $project);

        $invitation = $project->invitations()->findOrFail($invitationId);
        $invitation->revoke();

        return redirect()->back();
    }
}
