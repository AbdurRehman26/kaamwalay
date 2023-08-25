<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduledEmailFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'send_at' => $this->faker->dateTime(),
            'payload' => serialize([
                'recipients' => [[$this->faker->email() => $this->faker->firstName()]],
                'subject' => $this->faker->sentence(5),
                'templateName' => $this->faker->slug(3),
                'templateContent' => [],
            ]),
            'is_sent' => $this->faker->boolean(),
        ];
    }
}
