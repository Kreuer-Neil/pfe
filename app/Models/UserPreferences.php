<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class UserPreferences extends Model
{
    protected $fillable = ['user_id', 'location_id', 'onboarding_completed_at', 'dashboard_feed_hidden'];

    protected $casts = [
        'dashboard_feed_hidden' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function languages(): MorphToMany
    {
        return $this->morphToMany(Language::class, 'languageable');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function hasProjectPreferences()
    {
        return ($this->location()->count() > 0) || ($this->languages()->count() > 0) || ($this->tags()->count() > 0);
    }
}
