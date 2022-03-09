<?php

namespace App\Services\Order\V2;

use App\Events\API\Customer\Order\OrderPlaced;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Order\V1\CreateOrderService as V1CreateOrderService;
use App\Services\Order\Validators\CustomerAddressValidator;
use App\Services\Order\Validators\ItemsDeclaredValueValidator;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class CreateOrderService extends V1CreateOrderService
{
    /**
     * @throws Exception|Throwable
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
    protected function validate(): void
    {
        ItemsDeclaredValueValidator::validate($this->data);
        CustomerAddressValidator::validate($this->data);
    }

    /**
     * @throws OrderStatusHistoryWasAlreadyAssigned
     * @throws Throwable
     */
    protected function process(): void
    {
        DB::beginTransaction();

        $this->startOrder();
        $this->storePaymentPlan($this->data['payment_plan']);
        $this->storeShippingMethod($this->data['shipping_method']);
        $this->storeOrderAddresses($this->data['shipping_address'], $this->data['billing_address'], $this->data['customer_address']);
        $this->storeCustomerAddress($this->data['shipping_address'], $this->data['customer_address']);
        $this->storeCouponAndDiscount(! empty($this->data['coupon']) ? $this->data['coupon'] : []);
        $this->saveOrder();
        $this->storeOrderItems($this->data['items']);
        $this->storeShippingFee();
        $this->storeServiceFee();
        $this->storeGrandTotal();
        $this->storeWalletPaymentAmount(! empty($this->data['payment_by_wallet']) ? $this->data['payment_by_wallet'] : null);
        $this->storeGrandTotal();

        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::PLACED, $this->order);

        DB::commit();

        OrderPlaced::dispatch($this->order);
    }
}
