<?php

namespace App\Http\Resources\API\Customer\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCustomerShipmentResource;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\Customer\Order\ShippingMethod\ShippingMethodResource;
use App\Http\Resources\API\Customer\User\UserResource;

class OrderResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => $this->orderItems->sum('quantity'),
            'total_declared_value' => $this->orderItems->sum('declared_value_total'),
            'status' => $this->orderStatus->name ?? null,
            'admin_status' => $this->orderAdminStatus->name ?? null,
            'service_fee' => $this->service_fee,
            'shipping_fee' => $this->shipping_fee,
            'grand_total' => $this->grand_total,
            'created_at' => $this->formatDate($this->created_at),
            'customer' => new UserResource($this->user),
            'shipping_method' => new ShippingMethodResource($this->shippingMethod),
            'payment_plan' => new PaymentPlanResource($this->paymentPlan),
            'shipping_address' => new OrderAddressResource($this->shippingAddress),
            'billing_address' => new OrderAddressResource($this->billingAddress),
            'order_payment' => new OrderPaymentResource($this->orderPayment),
            'order_items' => new OrderItemCollection($this->orderItems),
            'invoice' => new InvoiceResource($this->invoice),
            'customer_shipment' => new OrderItemCustomerShipmentResource($this->orderItems[0]->orderItemCustomerShipment),
            'reviewed_by' => $this->reviewedBy ? $this->reviewedBy->getFullName() : null,
            'reviewed_at' => $this->formatDate($this->reviewed_at),
            'graded_by' => $this->gradedBy ? $this->gradedBy->getFullName() : null,
            'graded_at' => $this->formatDate($this->graded_at),
        ];
    }
}
