<?php

namespace Database\Factories;

use App\Models\Location;
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
            'location_id' => Location::factory(),
            'is_private' => $this->faker->boolean,
        ];
    }
}
