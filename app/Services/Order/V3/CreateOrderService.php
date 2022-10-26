<?php

namespace App\Services\Order\V3;

use App\Models\OrderPaymentPlan;
use App\Models\PaymentPlan;
use App\Services\Order\V2\CreateOrderService as BaseCreateOrderService;

class CreateOrderService extends BaseCreateOrderService
{
    protected function storePaymentPlan(array $paymentPlan): void
    {
        // This payment_plan_id is linked to originalPaymentPlan relationship
        $this->order->payment_plan_id = $paymentPlan['id'];

        $paymentPlan = PaymentPlan::find($paymentPlan['id']);
        $priceRanges = $paymentPlan->paymentPlanRanges;

        // @phpstan-ignore-next-line
        $totalItems = collect($this->data['items'])->sum('quantity');

        $priceRange = $priceRanges->first(function ($item, $key) use ($totalItems) {
            return ($item->min_cards <= $totalItems && $item->max_cards >= $totalItems) ||
                ($item->min_cards <= $totalItems && ! $item->max_cards);
        });

        $orderPaymentPlan = OrderPaymentPlan::create([
            'price' => $priceRange ? $priceRange->price : $paymentPlan->price,
            'max_protection_amount' => $paymentPlan->max_protection_amount,
            'turnaround' => $paymentPlan->turnaround,
        ]);

        // Column for paymentPlan relationship is order_payment_plan_id
        $this->order->paymentPlan()->associate($orderPaymentPlan);
    }
}
