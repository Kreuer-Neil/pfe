<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Str;

class LocationController extends Controller
{
    public function search(Request $request)
    {
        $validated = $request->validate([
            'q' => 'required|string|min:2|max:255',
        ]);

        return response()->json(self::searchNominatim($validated['q']));
    }

    /**
     * Proxies + caches a Nominatim search. This is the only place raw location
     * data enters the app - nothing derived from a client request body is ever
     * written to the locations table directly, only data fetched here.
     */
    public static function searchNominatim(string $query): array
    {
        return Cache::remember('nominatim_' . md5($query), now()->addDay(), function () use ($query) {
            return Http::withHeaders(['User-Agent' => 'ComeUnite/1.0'])
                ->get('https://nominatim.openstreetmap.org/search', [
                    'q' => $query,
                    'format' => 'json',
                    'limit' => 5,
                    'namedetails' => 1,
                ])->json() ?? [];
        });
    }

    /**
     * Resolves a client's location pick (search query + chosen osm_id/osm_type) back
     * to a trusted Location row, by re-reading the cached (or freshly re-fetched)
     * Nominatim results.
     */
    public static function resolveFromSearchCache(string $query, string $osmId, string $osmType): ?Location
    {
        $match = self::findInNominatimResults(self::searchNominatim($query), $osmId, $osmType);

        if (!$match) {
            // Cache may have expired between search and store - retry once, live.
            Cache::forget('nominatim_' . md5($query));
            $match = self::findInNominatimResults(self::searchNominatim($query), $osmId, $osmType);
        }

        return $match ? Location::findOrCreateFromNominatim($match) : null;
    }

    private static function findInNominatimResults(array $results, string $osmId, string $osmType): ?array
    {
        foreach ($results as $item) {
            if ((string) $item['osm_id'] === $osmId && $item['osm_type'] === $osmType) {
                return [
                    'osm_id' => (string) $item['osm_id'],
                    'osm_type' => $item['osm_type'],
                    'latitude' => $item['lat'],
                    'longitude' => $item['lon'],
                    'display_name' => $item['display_name'],
                    'name' => $item['namedetails']['name'] ?? Str::before($item['display_name'], ','),
                    'type' => $item['type'],
                ];
            }
        }

        return null;
    }
}
