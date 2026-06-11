<?php

namespace Database\Factories;

use App\Enums\Language;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition()
    {
        return [
            'name' => $name = $this->faker->unique()->company,
            'icon' => 'default_' . random_int(1, 2),
            'description' => $this->faker->text(),
            'slug' => Str::slug($name),
            'lang' => $this->faker->randomElement(Language::cases()),
            'coordinates' => "{$this->faker->latitude(49.30, 51.30)}, {$this->faker->longitude(2.30, 6.30)}",

            'is_private' => $this->faker->boolean,
        ];
    }
}
