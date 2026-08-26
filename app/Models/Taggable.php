<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\MorphPivot;

class Taggable extends MorphPivot
{
    protected $fillable = ['tag_id', 'taggable_id', 'taggable_type'];
}