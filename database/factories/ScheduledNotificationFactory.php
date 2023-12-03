<?php

namespace Database\Factories;

use App\Models\ScheduledNotification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ScheduledNotificationFactory extends Factory
{
    protected $model = ScheduledNotification::class;

    public function definition(): array
    {
        return [
            'send_at' => Carbon::now(),
            'notification_class' => $this->faker->word(),
            'notifiable_type' => User::class,
            'notifiable_id' => User::factory(),
            'payload' => $this->faker->sentence(),
            'is_sent' => $this->faker->boolean(),
            'check_class' => $this->faker->word(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
