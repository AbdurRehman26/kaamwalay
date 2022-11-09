<?php

namespace Database\Factories;

use App\Models\PaymentPlanRange;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\PaymentPlan;
use Illuminate\Database\Eloquent\Factories\Sequence;

class PaymentPlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'price' => $this->faker->numberBetween(20, 5000),
            'max_protection_amount' => $this->faker->numberBetween(500, 10000),
            'turnaround' => $this->faker->numberBetween(1, 30) . ' Day Turnaround',
            'display_position' => $this->faker->numberBetween(1, 8),
        ];
    }

    /**
     * Attach role to the newly created user.
     *
     * @param string $role
     * @return  $this
     */
    public function withPaymentPlanRanges(int $price = 18)
    {
        return $this->afterCreating(function (PaymentPlan $paymentPlan) use ($price) {
            PaymentPlanRange::factory()->count(5)->state(new Sequence(
                ['payment_plan_id' => $paymentPlan->id, 'min_cards' => 1, 'max_cards' => 20, 'price' => $price],
                ['payment_plan_id' => $paymentPlan->id, 'min_cards' => 21, 'max_cards' => 50],
                ['payment_plan_id' => $paymentPlan->id, 'min_cards' => 51, 'max_cards' => 100],
                ['payment_plan_id' => $paymentPlan->id, 'min_cards' => 101, 'max_cards' => 200],
                ['payment_plan_id' => $paymentPlan->id, 'min_cards' => 201, 'max_cards' => null],
            ))->create();
        });
    }
}
