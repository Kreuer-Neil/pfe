<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    protected $fillable = ['latitude', 'longitude', 'display_name', 'name', 'osm_id', 'osm_type', 'type'];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function userPreferences(): HasMany
    {
        return $this->hasMany(UserPreferences::class);
    }

    public static function findOrCreateFromNominatim(array $data): self
    {
        return self::firstOrCreate(
            ['osm_id' => $data['osm_id'], 'osm_type' => $data['osm_type']],
            $data
        );
    }

    /**
     * Deletes the location if no project or user preference references it anymore.
     */
    public function removeIfUnused(): void
    {
        if ($this->projects()->doesntExist() && $this->userPreferences()->doesntExist()) {
            $this->delete();
        }
    }

}
