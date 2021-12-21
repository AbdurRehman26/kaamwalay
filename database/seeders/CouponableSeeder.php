<?php

namespace Database\Seeders;

use App\Models\Couponable;
use App\Models\PaymentPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class CouponableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Couponable::factory()->count(5)->state(new Sequence(
            [
                'couponable_type' => PaymentPlan::class,
                'couponable_id' => PaymentPlan::inRandomOrder()->first()->id,
            ],
            [
                'couponable_type' => PaymentPlan::class,
                'couponable_id' => PaymentPlan::inRandomOrder()->first()->id,
            ],
            [
                'couponable_type' => PaymentPlan::class,
                'couponable_id' => PaymentPlan::inRandomOrder()->first()->id,
            ],
            [
                'couponable_type' => PaymentPlan::class,
                'couponable_id' => PaymentPlan::inRandomOrder()->first()->id,
            ],
            [
                'couponable_type' => PaymentPlan::class,
                'couponable_id' => PaymentPlan::inRandomOrder()->first()->id,
            ],
        ))->create();
        Couponable::factory()->count(5)->state(new Sequence(
            [
                'couponable_type' => User::class,
                'couponable_id' => User::inRandomOrder()->first()->id,
            ],
            [
                'couponable_type' => User::class,
                'couponable_id' => User::inRandomOrder()->first()->id,
            ],
            [
                'couponable_type' => User::class,
                'couponable_id' => User::inRandomOrder()->first()->id,
            ],
            [
                'couponable_type' => User::class,
                'couponable_id' => User::inRandomOrder()->first()->id,
            ],
            [
                'couponable_type' => User::class,
                'couponable_id' => User::inRandomOrder()->first()->id,
            ],
        ))->create();
    }
}
