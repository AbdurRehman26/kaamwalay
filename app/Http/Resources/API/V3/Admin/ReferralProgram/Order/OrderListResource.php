<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Admin\Coupon\CouponResource;
use App\Http\Resources\API\V3\Admin\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\V3\Admin\Order\OrderCustomerResource;
use App\Http\Resources\API\V3\Admin\Order\OrderStatusResource;
use App\Http\Resources\API\V3\Admin\User\UserResource;
use App\Models\Order;
use Illuminate\Http\Request;

/**
 * @mixin Order
 */
class OrderListResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => $this->orderItems->sum('quantity'),
            'total_declared_value' => $this->orderItems->sum('declared_value_total'),
            'grand_total' => $this->grand_total,
            'customer' => $this->whenLoaded('user', OrderCustomerResource::class),
            'owner' => new UserResource($this->salesman),
            'referrer' => new UserResource($this->user?->referredBy),
            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'payment_status' => $this->payment_status,
            'created_at' => $this->formatDate($this->created_at),
            'coupon' => $this->whenLoaded('coupon', CouponResource::class),
        ];
    }
}
