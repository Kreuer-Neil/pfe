<?php

namespace Database\Factories;

use App\Models\Participation;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ParticipationFactory extends Factory
{
    protected $model = Participation::class;

    public function definition(): array
    {
        return [
            'user_id' => User::all()->random()->id,
            'task_id' => Task::all()->random()->id,
        ];
    }
}
