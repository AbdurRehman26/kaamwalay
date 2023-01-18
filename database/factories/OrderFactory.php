<?php

namespace Database\Factories;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Coupon;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderPayment;
use App\Models\OrderPaymentPlan;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $grandTotal = $this->faker->randomFloat(2, 20, 10000);

        return [
            'order_number' => strtoupper($this->faker->uuid()),
            'shipping_fee' => $this->faker->randomFloat(2, 50, 500),
            'service_fee' => $this->faker->randomFloat(2, 50, 500),
            'grand_total' => $grandTotal,
            'grand_total_before_discount' => $grandTotal,
            'user_id' => User::factory()->withRole(config('permission.roles.customer')),
            'coupon_id' => Coupon::factory()->create(),
            'order_status_id' => OrderStatus::factory(),
            'payment_plan_id' => PaymentPlan::factory(),
            'order_payment_plan_id' => OrderPaymentPlan::factory(),
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
            if ($order->payment_status === OrderPaymentStatusEnum::PAID) {
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

    public function insuredShipping()
    {
        return $this->state(function (array $attributes) {
            return [
                'shipping_method_id' => ShippingMethod::factory()->insured(),
            ];
        });
    }
}
