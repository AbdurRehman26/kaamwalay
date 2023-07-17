<?php

namespace App\Services\Salesman\V3\Order;

use App\Events\API\Customer\Order\OrderPlaced;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\OrderStatus;
use App\Services\Salesman\V2\Order\CreateOrderService as V2CreateOrderService;
use Illuminate\Support\Facades\DB;
use Throwable;

class CreateOrderService extends V2CreateOrderService
{

    /**
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    protected function process(): void
    {
        DB::beginTransaction();

        $this->startOrder();
        $this->storePaymentPlan($this->data['payment_plan']);
        $this->storeShippingMethod($this->data['shipping_method']);
        if ($this->order->hasInsuredShipping()) {
            $this->storeOrderAddresses($this->data['shipping_address'], $this->data['billing_address'], $this->data['customer_address']);
            $this->storeCustomerAddress($this->data['shipping_address'], $this->data['customer_address']);
        }
        $this->saveOrder();
        $this->storeOrderItems($this->data['items']);
        $this->storeShippingFee();
        $this->storeServiceFee();
        $this->storeShippingInsuranceFee();
        $this->storeCleaningFee();
        $this->storeCouponAndDiscount(! empty($this->data['coupon']) ? $this->data['coupon'] : []);
        $this->storeGrandTotal();
        $this->associateSalesman();

        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::PLACED, $this->order);
        OrderPlaced::dispatch($this->order);

        DB::commit();
    }

}
