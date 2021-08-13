<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class OrderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'order_number' => $this->faker->uuid(),
            'shipping_fee' => $this->faker->randomFloat(2, 50, 500),
            'grand_total' => $this->faker->randomFloat(2, 20, 10000),
            'user_id' => User::factory()->withRole(config('permission.roles.customer')),
            'payment_plan_id' => PaymentPlan::factory(),
            'order_status_id' => OrderStatus::factory(),
            'shipping_order_address_id' => OrderAddress::factory(),
            'billing_order_address_id' => OrderAddress::factory(),
            'payment_method_id' => Arr::random([1, 2]),
            'shipping_method_id' => ShippingMethod::factory(),
            'invoice_id' => Invoice::factory(),
            'arrived_at' => $this->faker->dateTime(),
        ];
    }
}
