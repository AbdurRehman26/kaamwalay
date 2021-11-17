<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use App\Services\Payment\PaymentService;
use Illuminate\Database\Eloquent\Factories\Factory;

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
            'service_fee' => $this->faker->randomFloat(2, 50, 500),
            'grand_total' => $this->faker->randomFloat(2, 20, 10000),
            'user_id' => User::factory()->withRole(config('permission.roles.customer')),
            'order_status_id' => OrderStatus::factory(),
            'payment_plan_id' => PaymentPlan::factory(),
            'shipping_order_address_id' => OrderAddress::factory(),
            'billing_order_address_id' => OrderAddress::factory(),
            'payment_method_id' => PaymentMethod::factory(),
            'shipping_method_id' => ShippingMethod::factory(),
            'invoice_id' => Invoice::factory(),
            'arrived_at' => $this->faker->dateTime(),
        ];
    }

    public function withPayment(): OrderFactory
    {
        return $this->afterCreating(function (Order $order) {
            if ($order->order_status_id !== OrderStatus::PAYMENT_PENDING) {
                $order->orderPayments()->save(
                    OrderPayment::factory()->stripe()->make([
                        'amount' => $order->grand_total,
                        'type' => OrderPayment::TYPE_ORDER_PAYMENT,
                        'created_at' => $order->created_at,
                        'provider_fee' => round(($order->grand_total * 0.029) + 0.3, 2),
                    ])
                );
                if ($order->order_status_id === OrderStatus::CANCELLED) {
                    $order->orderPayments()->save(
                        OrderPayment::factory()->stripe()->make([
                            'amount' => $order->grand_total,
                            'type' => OrderPayment::TYPE_REFUND,
                            'created_at' => $order->created_at,
                            'provider_fee' => round(($order->grand_total * 0.029) + 0.3, 2),
                        ])
                    );
                }
            }
        });
    }
}
