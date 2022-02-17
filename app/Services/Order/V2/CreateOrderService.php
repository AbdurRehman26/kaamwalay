<?php

namespace App\Services\Order\V2;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\OrderStatus;
use App\Services\Order\V1\CreateOrderService as V1CreateOrderService;
use App\Services\Order\Validators\CustomerAddressValidator;
use App\Services\Order\Validators\ItemsDeclaredValueValidator;
use Exception;
use Illuminate\Support\Facades\DB;
use Throwable;

class CreateOrderService extends V1CreateOrderService
{
    /**
     * @throws Exception
     */
    protected function validate()
    {
        ItemsDeclaredValueValidator::validate($this->data);
        CustomerAddressValidator::validate($this->data);
    }

    /**
     * @throws OrderStatusHistoryWasAlreadyAssigned
     * @throws Throwable
     */
    protected function process()
    {
        DB::beginTransaction();

        $this->startOrder();
        $this->storePaymentPlan($this->data['payment_plan']);
        $this->storeShippingMethod($this->data['shipping_method']);
        $this->storeOrderAddresses($this->data['shipping_address'], $this->data['billing_address'], $this->data['customer_address']);
        $this->storeCustomerAddress($this->data['shipping_address'], $this->data['customer_address']);
        $this->saveOrder();
        $this->storeOrderItems($this->data['items']);
        $this->storeShippingFee();
        $this->storeServiceFee();
        $this->storeGrandTotal();

        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::DEFAULT_ORDER_STATUS, $this->order);

        DB::commit();
    }
}
