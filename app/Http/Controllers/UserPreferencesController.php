<?php

namespace App\Http\Controllers;

use App\Http\Resources\User\UserPreferencesResource;
use App\Models\Language;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserPreferencesController extends Controller
{
    public function edit(Request $request)
    {
        $preferences = $request->user()->preferences;

        return Inertia::render('settings/preferences', [
            'preferences' => (new UserPreferencesResource($preferences))->toArray($request),
            'languagesList' => Language::all()->pluck('name'),
            'tagsList' => Tag::all()->pluck('name'),
        ]);
    }

    public function updateLanguages(Request $request)
    {
        $validated = $request->validate([
            'languages' => 'nullable|array',
            'languages.*' => 'string|exists:languages,name',
        ]);

        $preferences = $request->user()->preferences;
        $ids = Language::whereIn('name', $validated['languages'] ?? [])->pluck('id');
        $preferences->languages()->sync($ids);

        Inertia::flash(['success' => true]);
        return redirect()->back();
    }

    public function updateTags(Request $request)
    {
        $validated = $request->validate([
            'tags' => 'nullable|array|max:7',
            'tags.*' => 'string|exists:tags,name',
        ]);

        $preferences = $request->user()->preferences;
        $ids = Tag::whereIn('name', $validated['tags'] ?? [])->pluck('id');
        $preferences->tags()->sync($ids);

        Inertia::flash(['success' => true]);
        return redirect()->back();
    }

    public function updateLocation(Request $request)
    {
        $preferences = $request->user()->preferences;

        $validated = $request->validate([
            'q' => 'nullable|required_with:osm_id,osm_type|string|max:255',
            'osm_id' => 'nullable|required_with:q|string|max:255',
            'osm_type' => 'nullable|required_with:q|string|max:255',
        ]);

        $oldLocation = $preferences->location;

        if (!empty($validated['osm_id'])) {
            $location = LocationController::resolveFromSearchCache($validated['q'], $validated['osm_id'], $validated['osm_type']);

            if (!$location) {
                return redirect()->back()->withErrors(['osm_id' => __('validation.location_selection_expired')]);
            }

            $preferences->location_id = $location->id;
        } else {
            $preferences->location_id = null;
        }

        $preferences->save();

        if ($oldLocation && $oldLocation->id !== $preferences->location_id) {
            $oldLocation->removeIfUnused();
        }

        Inertia::flash(['success' => true]);
        return redirect(route('preferences.edit'));
    }
}
