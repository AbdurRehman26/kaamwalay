<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;

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
            'order_number' => $this->faker->uuid,
            'shipping_amount' => $this->faker->randomFloat(2, 10, 99999999.99),
            'grand_total' => $this->faker->randomFloat(2, 10, 99999999.99),
            'user_id' => User::factory()->withRole(Role::CUSTOMER_ROLE_ID),
            'payment_plan_id' => PaymentPlan::factory(),
            'order_status_id' => OrderStatus::factory(),
            'order_address_id' => OrderAddress::factory(),
            'payment_method_id' => PaymentMethod::factory(),
            'shipping_method_id' => ShippingMethod::factory(),
            'invoice_id' => Invoice::factory(),
            'arrived_at' => $this->faker->dateTime(),
        ];
    }
}
