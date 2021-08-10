<?php

namespace App\Services\Order;

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\PaymentPlan;
use App\Models\ShippingMethod;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateOrderService
{
    protected static Order $order;

    public static function create(array $data): Order
    {
        if (! self::validateData($data)) {
            throw new \Exception('Order could not be placed.');
        }

        try {
            DB::beginTransaction();

            self::startOrder();
            self::storePaymentPlan($data['payment_plan']);
            self::storeShippingMethod($data['shipping_method']);
            self::storePaymentMethod($data['payment_method']);
            self::storeOrderAddress($data['shipping_address']);
            self::saveOrder();
            self::storeOrderItems($data['items']);

            DB::commit();

            return self::$order;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw new \Exception('Order could not be placed.');
        }
    }

    protected static function startOrder()
    {
        self::$order = new Order();
    }

    protected static function storePaymentPlan(array $paymentPlan)
    {
        self::$order->payment_plan_id = $paymentPlan['id'];
    }

    protected static function storeShippingMethod(array $shippingMethod)
    {
        self::$order->shipping_method_id = $shippingMethod['id'];
    }

    protected static function storePaymentMethod(array $paymentMethod)
    {
        self::$order->payment_method_id = $paymentMethod['id'];
    }

    protected static function storeOrderAddress(array $shippingAddress)
    {
        $orderAddress = OrderAddress::create($shippingAddress);

        self::$order->orderAddress()->associate($orderAddress);
    }

    protected static function saveOrder()
    {
        self::$order->order_number = OrderNumberGeneratorService::generate();
        self::$order->user()->associate(auth()->user());
        self::$order->orderStatus()->associate(OrderStatus::find(1));
        self::$order->save();
    }

    protected static function storeOrderItems(array $items)
    {
        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => self::$order->id,
                'card_product_id' => $item['card_product']['id'],
                'quantity' => $item['quantity'],
                'declared_value_per_unit' => $item['declared_value_per_unit'],
                'declared_value_total' => $item['quantity'] * $item['declared_value_per_unit'],
            ]);
        }
    }

    protected static function validateData(array $data): bool
    {
        try {
            PaymentPlan::findOrFail($data['payment_plan']['id']);

            foreach ($data['items'] as $item) {
                CardProduct::firstOrFail($item['card_product']['id']);
            }

            ShippingMethod::findOrFail($data['shipping_method']['id']);
            PaymentMethod::findOrFail($data['payment_method']['id']);
        } catch (\Exception) {
            return false;
        }

        return true;
    }
}
