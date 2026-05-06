<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectNews;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectNewsFactory extends Factory
{
    protected $model = ProjectNews::class;

    public function definition(): array
    {
        return [
            'project_id' => $project = Project::inRandomOrder()->first(),
            'user_id' => $project->members->random(1)->first(),
            'title' => $this->faker->text(20),
            'text_content' => $this->faker->text(50),
        ];
    }
}
