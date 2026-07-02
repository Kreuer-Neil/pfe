<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    public function projects():BelongsToMany
    {
        return $this->belongsToMany(Project::class, ProjectTag::class);
    }

    // TODO keep for later
//    public function news():ProjectNews
//    {
//        return ProjectNews::whereBelongsTo($this->projects()->get());
//    }
}
