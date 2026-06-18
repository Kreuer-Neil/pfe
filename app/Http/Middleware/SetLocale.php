<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Str;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // TODO add user locale check before cookie + setting
        $locale =
            // auth()->user()->locale ??
            $request->cookie('lang') ??
            (in_array(
                $preferredLang = Str::beforeLast($request->getPreferredLanguage(), '_'),
                config('app.locales')
            ) ? $preferredLang ?? null : null) ??
            config('app.fallback_locale');
//        dd($request->cookie('locale'));
        app()->setLocale($locale);

        return $next($request);
    }
}
