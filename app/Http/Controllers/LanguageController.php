<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LanguageController extends Controller
{
    public function switchLanguage(Request $request)
    {
        $validated = $request->validate([
            'lang' => 'required|string',
        ]);
        $lang = Str::lower($validated['lang']);
        if (in_array($lang, config('app.locales'))) {
            if ($request->user()) {
                $language = Language::firstOrCreate(['name' => Str::upper($lang)]);
                $request->user()->update(['language_id' => $language->id]);
            }

            $cookie = cookie('lang', $lang, 60 * 24 * 31 * 12);

            return redirect()->back()->cookie($cookie);
        }
        return redirect()->back();
    }
}
