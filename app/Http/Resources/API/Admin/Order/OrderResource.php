<?php

namespace App\Http\Resources\API\Admin\Order;

use App\Http\Resources\API\Admin\Order\OrderItem\OrderItemShipmentResource;
use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\Customer\Order\OrderAddressResource;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCustomerShipmentResource;
use App\Http\Resources\API\Customer\Order\OrderPaymentResource;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\Customer\Order\ShippingMethod\ShippingMethodResource;
use Illuminate\Http\Request;

class OrderResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => $this->orderItems->sum('quantity'),
            'total_declared_value' => $this->orderItems->sum('declared_value_total'),
            'status' => $this->orderStatus->name,
            'service_fee' => $this->service_fee,
            'shipping_fee' => $this->shipping_fee,
            'grand_total' => $this->grand_total,
            'created_at' => $this->formatDate($this->created_at),
            'customer' => new OrderCustomerResource($this->user),
            'shipping_method' => new ShippingMethodResource($this->shippingMethod),
            'payment_plan' => new PaymentPlanResource($this->paymentPlan),
            'shipping_address' => new OrderAddressResource($this->shippingAddress),
            'billing_address' => new OrderAddressResource($this->billingAddress),
            'order_payment' => new OrderPaymentResource($this->orderPayment),
            'order_items' => new OrderItemCollection($this->orderItems),
            'invoice' => new InvoiceResource($this->invoice),
            'customer_shipment' => new OrderItemCustomerShipmentResource($this->orderItems[0]->orderItemCustomerShipment),
            'shipment' => new OrderItemShipmentResource($this?->orderItems[0]?->orderItemShipment),
        ];
    }
}
