<?php

namespace App\Services\Order;

use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Services\Admin\Order\OrderItemService;
use App\Services\Admin\OrderStatusHistoryService;
use App\Services\Coupon\CouponService;
use App\Services\Order\Shipping\ShippingFeeService;
use App\Services\Order\Validators\CouponAppliedValidator;
use App\Services\Order\Validators\CustomerAddressValidator;
use App\Services\Order\Validators\GrandTotalValidator;
use App\Services\Order\Validators\ItemsDeclaredValueValidator;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class CreateOrderService
{
    protected Order $order;
    protected array $data;

    public function __construct(
        private OrderStatusHistoryService $orderStatusHistoryService,
        private OrderItemService $orderItemService,
        private CouponService $couponService
    ) {
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Order
    {
        $this->data = $data;

        try {
            $this->validate();
            $this->process();

            return $this->order;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
    }

    /**
     * @throws Exception
     */
    protected function validate()
    {
        ItemsDeclaredValueValidator::validate($this->data);
        CustomerAddressValidator::validate($this->data);
        CouponAppliedValidator::validate($this->data);
    }

    /**
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    protected function process()
    {
        DB::beginTransaction();

        $this->startOrder();
        $this->storePaymentPlan($this->data['payment_plan']);
        $this->storeShippingMethod($this->data['shipping_method']);
        $this->storePaymentMethod($this->data['payment_method']);
        $this->storeOrderAddresses($this->data['shipping_address'], $this->data['billing_address'], $this->data['customer_address']);
        $this->storeCustomerAddress($this->data['shipping_address'], $this->data['customer_address']);
        $this->saveOrder();
        $this->storeOrderItems($this->data['items']);
        $this->storeCouponAndDiscount(! empty($this->data['coupon']) ? $this->data['coupon'] : []);
        $this->storeShippingFee();
        $this->storeServiceFee();
        $this->storePaymentMethodDiscount($this->data['payment_method']);
        $this->storeGrandTotal();
        $this->storeOrderPayment($this->data['payment_provider_reference']);

        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::DEFAULT_ORDER_STATUS, $this->order);

        DB::commit();
    }

    protected function startOrder()
    {
        $this->order = new Order();
    }

    protected function storePaymentPlan(array $paymentPlan)
    {
        $this->order->payment_plan_id = $paymentPlan['id'];
    }

    protected function storeShippingMethod(array $shippingMethod)
    {
        $this->order->shipping_method_id = $shippingMethod['id'];
    }

    protected function storePaymentMethod(array $paymentMethod)
    {
        $this->order->payment_method_id = $paymentMethod['id'];
    }

    protected function storeOrderAddresses(array $shippingAddress, array $billingAddress, array $customerAddress)
    {
        if (! empty($customerAddress['id'])) {
            $shippingAddress = OrderAddress::create(CustomerAddress::find($customerAddress['id'])->toArray());
        } else {
            $shippingAddress = OrderAddress::create($shippingAddress);
        }

        $this->order->shippingAddress()->associate($shippingAddress);

        if ($billingAddress['same_as_shipping']) {
            $this->order->billingAddress()->associate($shippingAddress);
        } else {
            $billingAddress = OrderAddress::create($billingAddress);
            $this->order->billingAddress()->associate($billingAddress);
        }
    }

    protected function storeCustomerAddress(array $shippingAddress, $customerAddress)
    {
        if ($shippingAddress['save_for_later'] && empty($customerAddress['id'])) {
            CustomerAddress::create(array_merge(
                $shippingAddress,
                [
                    'user_id' => auth()->user()->id,
                ]
            ));
        }
    }

    protected function saveOrder()
    {
        $this->order->user()->associate(auth()->user());
        $this->order->save();
        $this->order->order_number = OrderNumberGeneratorService::generate($this->order);
        $this->order->save();
    }

    /**
     * @throws OrderItemDoesNotBelongToOrder
     */
    protected function storeOrderItems(array $items)
    {
        foreach ($items as $item) {
            for ($i = 0; $i < $item['quantity']; $i++) {
                $storedItem = OrderItem::create([
                    'order_id' => $this->order->id,
                    'card_product_id' => $item['card_product']['id'],
                    'quantity' => 1,
                    'declared_value_per_unit' => $item['declared_value_per_unit'],
                    'declared_value_total' => $item['declared_value_per_unit'],
                ]);
              
                $this->orderItemService->changeStatus($this->order, $storedItem, ['status' => 'pending'], auth()->user());
            }
        }
    }

    protected function storeShippingFee()
    {
        $shippingFee = ShippingFeeService::calculateForOrder($this->order);

        $this->order->shipping_fee = $shippingFee;
        $this->order->save();
    }

    protected function storeServiceFee(): void
    {
        $this->order->service_fee = $this->order->paymentPlan->price * $this->order->orderItems()->sum('quantity');
        $this->order->save();
    }

    protected function storeGrandTotal(): void
    {
        $this->order->grand_total_before_discount = $this->order->service_fee + $this->order->shipping_fee;
        $this->order->grand_total = $this->order->service_fee + $this->order->shipping_fee - $this->order->discounted_amount - $this->order->pm_discounted_amount;

        GrandTotalValidator::validate($this->order);

        $this->order->save();
    }

    protected function storeOrderPayment(array $data)
    {
        $orderPaymentData = [
            'order_id' => $this->order->id,
            'payment_method_id' => $this->order->paymentMethod->id,
        ];
        if ($this->order->paymentMethod->code === 'stripe') {
            $response = $this->order->user->findPaymentMethod($data['id']);
            $orderPaymentData = array_merge(
                $orderPaymentData,
                [
                    'response' => json_encode($response),
                    'payment_provider_reference_id' => $data['id'],
                ]
            );
        }

        OrderPayment::create($orderPaymentData);
    }

    protected function storeCouponAndDiscount(array $couponData): void
    {
        if (! empty($couponData['code'])) {
            $this->order->coupon_id = $this->couponService->returnCouponIfValid($couponData['code'])->id;
            $this->order->discounted_amount = $this->couponService->calculateDiscount($this->order->coupon, $this->order);
            $this->order->save();
        }
    }

    protected function storePaymentMethodDiscount(array $paymentMethod): void
    {
        $paymentMethod = PaymentMethod::find($paymentMethod['id']);

        if ($paymentMethod->code === 'ags') {
            $this->order->pm_discounted_amount = round($this->order->service_fee * config('configuration.keys.collector_coin_discount_percentage.value') / 100, 2);
            $this->order->save();
        }
    }
}
