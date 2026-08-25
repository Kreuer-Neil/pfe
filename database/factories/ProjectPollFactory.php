<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectPoll;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectPollFactory extends Factory
{
    protected $model = ProjectPoll::class;

    public function definition(): array
    {
        return [
            'project_id' => $project = Project::inRandomOrder()->first(),
            'user_id' => $project->members->random(1)->first(),
            'title' => $this->faker->sentence(6),
            'multi' => false,
            'end_date' => now()->addWeek(),
        ];
    }

    public function expired(): static
    {
        return $this->state(fn () => ['end_date' => now()->subDay()]);
    }
}
