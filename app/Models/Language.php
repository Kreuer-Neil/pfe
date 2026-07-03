<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Language extends Model
{
    public $timestamps = false;

    protected $fillable = ['name'];

    public function userPreferences(): MorphToMany
    {
        return $this->morphedByMany(UserPreferences::class, 'languageable');
    }
}