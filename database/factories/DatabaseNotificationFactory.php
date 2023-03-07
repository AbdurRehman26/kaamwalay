<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DatabaseNotification>
 */
class DatabaseNotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $data = [
            'title' => 'Title',
            'body' => 'Body',
            'intent' => [],
        ];

        return [
            'id' => $this->faker->uuid(),
            'type' => \App\Notifications\Order\OrderStatusChangedNotification::class,
            'notifiable_type' => \App\Models\User::class,
            'notifiable_id' => User::factory(),
            'data' => $data,
            'read_at' => null,
        ];
    }
}
