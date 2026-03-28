<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->company(),
            'description' => $this->faker->text(),
            // TODO fix
//            'project_id' => ($project = Project::all()->random())->id,
//            'user_id' => $project->members()->get()->random()->id,
            'min_participations' => random_int(2, 12),
            'due_at' => $this->faker->dateTimeBetween('-1 days', '1 year'),
        ];
    }
}
