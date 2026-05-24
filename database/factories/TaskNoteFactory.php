<?php

namespace Database\Factories;

use App\Models\TaskNote;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskNoteFactory extends Factory
{
    protected $model = TaskNote::class;

    public function definition(): array
    {
        return [
            'owner_id' => User::inRandomOrder()->first(),
            'content' => $this->faker->text(50),
        ];
    }
}
