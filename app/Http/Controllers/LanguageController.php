<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LanguageController extends Controller
{
    public function switchLanguage(Request $request)
    {
        $validated = $request->validate([
            'lang' => 'required|string',
        ]);
        $lang = Str::lower($validated['lang']);
        if (in_array($lang, config('app.locales'))) {
            $cookie = cookie('lang', $lang, 60 * 24 * 31);
        }
        return redirect()->back()->cookie($cookie);
    }
}
