<?php

namespace App\Services\Order;

use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Services\Order\Shipping\ShippingFeeService;
use App\Services\Order\Validators\ItemsDeclaredValueValidator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateOrderService
{
    protected static Order $order;
    protected static array $data;

    public static function create(array $data): Order
    {
        self::$data = $data;

        try {
            self::validate();
            self::process();

            return self::$order;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw new \Exception('Order could not be placed.');
        }
    }

    protected static function validate()
    {
        ItemsDeclaredValueValidator::validate(self::$data);
    }

    protected static function process()
    {
        DB::beginTransaction();

        self::startOrder();
        self::storePaymentPlan(self::$data['payment_plan']);
        self::storeShippingMethod(self::$data['shipping_method']);
        self::storePaymentMethod(self::$data['payment_method']);
        self::storeOrderAddresses(self::$data['shipping_address'], self::$data['billing_address']);
        self::storeCustomerAddress(self::$data['shipping_address']);
        self::saveOrder();
        self::storeOrderItems(self::$data['items']);
        self::storeShippingFee();
        self::storeGrandTotal();

        DB::commit();
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

    protected static function storeOrderAddresses(array $shippingAddress, array $billingAddress)
    {
        $shippingAddress = OrderAddress::create($shippingAddress);
        self::$order->shippingAddress()->associate($shippingAddress);

        if ($billingAddress['same_as_shipping']) {
            self::$order->billingAddress()->associate($shippingAddress);
        } else {
            $billingAddress = OrderAddress::create($billingAddress);
            self::$order->billingAddress()->associate($billingAddress);
        }
    }

    protected static function storeCustomerAddress(array $shippingAddress)
    {
        if ($shippingAddress['save_for_later']) {
            CustomerAddress::create(array_merge(
                $shippingAddress,
                [
                    'user_id' => auth()->user()->id,
                ]
            ));
        }
    }

    protected static function saveOrder()
    {
        self::$order->user()->associate(auth()->user());
        self::$order->order_status_id = OrderStatus::DEFAULT_ORDER_STATUS;
        self::$order->save();
        self::$order->order_number = OrderNumberGeneratorService::generate(self::$order);
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

    protected static function storeShippingFee()
    {
        $shippingFee = ShippingFeeService::calculateForOrder(self::$order);

        self::$order->shipping_fee = $shippingFee;
        self::$order->save();
    }

    protected static function storeGrandTotal()
    {
        $serviceFee = self::$order->paymentPlan->price * self::$order->orderItems()->sum('quantity');

        self::$order->grand_total = $serviceFee + self::$order->shipping_fee;
        self::$order->save();
    }
}
