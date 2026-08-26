<?php

namespace Database\Factories;

use App\Models\PollChoice;
use App\Models\ProjectPoll;
use Illuminate\Database\Eloquent\Factories\Factory;

class PollChoiceFactory extends Factory
{
    protected $model = PollChoice::class;

    public function definition(): array
    {
        return [
            'project_poll_id' => ProjectPoll::factory(),
            'label' => $this->faker->word(),
            'position' => 0,
        ];
    }
}
