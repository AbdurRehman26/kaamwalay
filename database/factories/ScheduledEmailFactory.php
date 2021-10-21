<?php

namespace Database\Factories;

use App\Models\ScheduledEmail;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduledEmailFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ScheduledEmail::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'send_at' => $this->faker->dateTime(),
            'payload' => serialize([
                'recipients' => [$this->faker->email() => $this->faker->firstName()],
                'subject' => $this->faker->sentence(5),
                'templateName' => $this->faker->slug(3),
                'templateContent' => [],
            ]),
            'is_sent' => $this->faker->boolean(),
        ];
    }
}
