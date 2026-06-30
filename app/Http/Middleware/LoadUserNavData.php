<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LoadUserNavData
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            auth()->user()->load('projects');
            // TODO remove this when fixed Auth::user passed to front-end and projects loaded with auth user.
            // Inertia::share('userProjects', fn() => ProjectContextResource::collection(auth()->user()->projects)->toArray($request));
        }
        return $next($request);
    }
}
