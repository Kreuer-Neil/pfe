<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFollow extends Model
{

    protected $fillable = [
        'user_id',
        'followed_user_id',
    ];
}
