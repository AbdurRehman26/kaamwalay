<?php

namespace App\Services\Order;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Services\Order\Validators\CustomerAddressValidator;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class UpdateAddressOrderService
{
    protected Order $order;
    protected array $data;

    /**
     * @throws Exception
     */
    public function save(Order $order, array $data): Order
    {
        $this->data = $data;
        $this->order = $order;

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
        CustomerAddressValidator::validate($this->data);
    }

    /**
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    protected function process()
    {
        DB::beginTransaction();

        $this->storeShippingMethod($this->data['shipping_method']);
        $this->storeOrderAddresses($this->data['shipping_address'], $this->data['customer_address']);
        $this->storeCustomerAddress($this->data['shipping_address'], $this->data['customer_address']);
        $this->saveOrder();
        $this->order->save();

        DB::commit();
    }

    protected function storeShippingMethod(array $shippingMethod)
    {
        $this->order->shipping_method_id = $shippingMethod['id'];
    }

    protected function storeOrderAddresses(array $shippingAddress, array $customerAddress)
    {
        if (! empty($customerAddress['id'])) {
            $shippingAddress = OrderAddress::create(CustomerAddress::find($customerAddress['id'])->toArray());
        } else {
            $shippingAddress = OrderAddress::create($shippingAddress);
        }

        $this->order->shippingAddress()->associate($shippingAddress);

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

    protected function saveOrder(): void
    {
        $this->order->order_step = 'second_step';
        $this->order->save();
    }
}
