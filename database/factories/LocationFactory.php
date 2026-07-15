<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        return [
            'osm_id' => (string) $this->faker->unique()->randomNumber(8),
            'osm_type' => $this->faker->randomElement(['node', 'way', 'relation']),
            'latitude' => $this->faker->latitude(49.30, 51.30),
            'longitude' => $this->faker->longitude(2.30, 6.30),
            'display_name' => $this->faker->city() . ', Belgique',
            'name' => $this->faker->city(),
            'type' => $this->faker->randomElement(['city', 'suburb', 'town', 'village']),
        ];
    }
}
