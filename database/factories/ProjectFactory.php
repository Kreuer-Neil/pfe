<?php

namespace Database\Factories;

use App\Enums\Language;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'icon' => $this->faker->word(),
//            'icon'=> Icons::randomIcon->id(),
            'description' => $this->faker->text(),
            'status' => $this->faker->text(),
            'lang' => $this->faker->randomElement(Language::cases()),
            // + radius for coordinates?
            'coordinates' => "[{$this->faker->latitude(49.30, 51.30)}, {$this->faker->longitude(2.30, 6.30)}]",
            // Must be unique
            'slug' => $this->faker->slug(6),

            'is_private' => $this->faker->boolean,
        ];
    }
}
