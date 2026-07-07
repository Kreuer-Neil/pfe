<?php

namespace App\Http\Controllers;

use App\Http\Resources\TagRessourceCollection;
use App\Http\Resources\User\UserPreferencesResource;
use App\Models\Language;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function edit(Request $request)
    {
        $preferences = $request->user()->preferences;

        if ($preferences->onboarding_completed_at->isBefore(now())) {
            return redirect(route('dashboard'));
        }

        return Inertia::render('onboarding', [
            'preferences' => (new UserPreferencesResource($preferences))->toArray($request),
            'languagesList' => Language::all()->pluck('name'),
            'tagsList' => (new TagRessourceCollection(Tag::all()))->toArray($request),
        ]);
    }

    public function complete(Request $request)
    {
        $preferences = $request->user()->preferences;

        if ($preferences->onboarding_completed_at->isBefore(now())) {
            return redirect(route('dashboard'));
        }

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

        $preferences->onboarding_completed_at = now();
        $preferences->save();

        if ($oldLocation && $oldLocation->id !== $preferences->location_id) {
            $oldLocation->removeIfUnused();
        }

        return redirect(route('dashboard'));
    }
}
