<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskNote extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['content', 'task_id', 'user_id'];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}