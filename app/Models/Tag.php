<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends Model
{
    public $timestamps = false;

    protected $fillable = ['name'];

    public function projects(): MorphToMany
    {
        return $this->morphedByMany(Project::class, 'taggable');
    }

    // TODO keep for later
//    public function news():ProjectNews
//    {
//        return ProjectNews::whereBelongsTo($this->projects()->get());
//    }
}
