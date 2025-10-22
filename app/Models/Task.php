<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    protected $fillable = ['name', 'description','project_id','starting_at','ending_at'];
    use SoftDeletes;
}
