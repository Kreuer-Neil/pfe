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
            'name'=> $this->faker->company,
//            'icon'=> Icons::randomIcon->id(),
            'description'=> $this->faker->text(),
            'status'=> $this->faker->text(),
            'is_private'=> $this->faker->boolean,
        ];
    }
}
