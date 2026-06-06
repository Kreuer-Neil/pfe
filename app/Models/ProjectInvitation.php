<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectInvitation extends Model
{
    use SoftDeletes;
    protected $fillable = ['uses',
        'project_id',
        'code',
        'expires_at'
    ];

    public function project():BelongsTo
    {
        return $this->BelongsTo(Project::class);
    }

    public function isValid():bool
    {
        return $this->exists() && (!$this->expires_at || $this->expires_at > now()) && $this->uses !== 0;
    }
}
