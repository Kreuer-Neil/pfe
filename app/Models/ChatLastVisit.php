<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatLastVisit extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'chat_room_id'];
}
