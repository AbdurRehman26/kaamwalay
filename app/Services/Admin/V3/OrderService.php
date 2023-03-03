<?php

namespace App\Services\Admin\V3;

use App\Models\Country;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Services\Admin\V2\OrderService as V2OrderService;

class OrderService extends V2OrderService
{

    public function updateShippingAddress(Order $order, array $data): Order
    {
        $data['country_id'] = Country::whereCode($data['country_code'] ?? 'US')->first()->id;
        $data['phone'] = $data['phone'] ?? '';

        $orderAddress = OrderAddress::create($data);

        if ($order->hasBillingAddress() && $order->hasSameShippingAndBillingAddresses()) {
            $order->billingAddress()->associate($orderAddress);
        }

        $order->shippingAddress()->associate($orderAddress);

        $order->save();

        return $order;
    }
}
