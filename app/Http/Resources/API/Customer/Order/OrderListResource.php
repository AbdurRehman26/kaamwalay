<?php

namespace App\Http\Resources\API\Customer\Order;

use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderListResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'created_at' => Carbon::parse($this->created_at)->toDate(),
            'arrived_at' => Carbon::parse($this->arrived_at)->toDate(),
            'payment_plan' => new PaymentPlanResource($this->paymentPlan),
            'number_of_cards' => $this->orderItems->sum('quantity'),
            'status' => $this->orderStatus->name,
        ];
    }
}
