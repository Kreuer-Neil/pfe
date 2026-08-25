<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectPermission extends Model
{
    use HasFactory;

    protected $fillable = ['project_id', 'allow_members_invitations'];

    protected $casts = [
        'allow_members_invitations' => 'boolean',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
