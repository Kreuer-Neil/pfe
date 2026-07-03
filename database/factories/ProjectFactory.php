<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->company,
            'icon' => 'default_' . random_int(1, 2),
            'description' => $this->faker->text(),
            // TODO use this for seeder coordinates
            // {$this->faker->latitude(49.30, 51.30)}, {$this->faker->longitude(2.30, 6.30)}
            'is_private' => $this->faker->boolean,
        ];
    }
}
