<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\MorphPivot;

class Languageable extends MorphPivot
{
    protected $fillable = ['language_id', 'languageable_id', 'languageable_type'];
}