<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Project extends Model
{
    protected $fillable = ['name','icon','description','status','is_private'];

    use HasFactory;


    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class,ProjectUser::class)->withPivot('role'); // attach roles
    }
}
