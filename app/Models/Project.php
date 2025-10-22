<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ['name','icon','description','status','is_private'];

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class,Member::class)->withPivot('role'); // attach roles
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
