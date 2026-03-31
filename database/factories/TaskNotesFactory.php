<?php

namespace Database\Factories;

use App\Models\TaskNotes;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskNotesFactory extends Factory
{
    protected $model = TaskNotes::class;

    public function definition(): array
    {
        return [
            'owner_id' => User::inRandomOrder()->first(),
            'content' => $this->faker->text(50),
        ];
    }
}
