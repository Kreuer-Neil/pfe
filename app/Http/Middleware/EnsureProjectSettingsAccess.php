<?php

namespace App\Http\Middleware;

use App\Models\Project;
use Closure;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gates the projects/settings/* pages (as opposed to the update actions, which use the
 * built-in `can:` middleware and 403 on denial). Redirecting here instead is friendlier for
 * someone who just navigated to a settings URL they don't have access to, rather than someone
 * actively attempting a mutation.
 */
class EnsureProjectSettingsAccess
{
    public function handle(Request $request, Closure $next, string $ability): Response
    {
        /** @var Project $project */
        $project = $request->route('project');

        if (!Gate::allows($ability, $project)) {
            return redirect(route('projects.show', $project));
        }

        return $next($request);
    }
}