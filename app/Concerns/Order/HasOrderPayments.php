<?php

namespace App\Concerns\Order;

use App\Models\OrderPayment;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOrderPayments
{
    public function firstOrderPayment(): HasOne
    {
        return $this->hasOne(OrderPayment::class)->oldestOfMany();
    }

    public function firstCollectorCoinOrderPayment(): HasOne
    {
        return $this->hasOne(OrderPayment::class)->whereRelation('paymentMethod', 'code', 'collector_coin')->oldestOfMany();
    }

    public function lastOrderPayment(): HasOne
    {
        return $this->hasOne(OrderPayment::class)->latestOfMany();
    }

    public function orderPayments(): HasMany
    {
        return $this->hasMany(OrderPayment::class);
    }

    public function extraCharges(): HasMany
    {
        return $this->hasMany(OrderPayment::class)->where('type', OrderPayment::TYPE_EXTRA_CHARGE);
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(OrderPayment::class)->where('type', OrderPayment::TYPE_REFUND);
    }

    public function updateAfterExtraCharge(float $amount): void
    {
        $this->fill([
            'extra_charge_total' => $this->extra_charge_total + $amount,
            'grand_total' => $this->grand_total + $amount,
        ]);

        $this->save();
    }

    public function createOrderPayment(array $data, User $user, ?int $paymentMethodId = null): void
    {
        $this->orderPayments()->create(
            [
                'request' => json_encode($data['request']),
                'response' => json_encode($data['response']),
                'payment_method_id' => $paymentMethodId ?? $this->payment_method_id,
                'user_id' => $user->id,
            ] + $data
        );
    }

    public function updateAfterRefund(float $amount): void
    {
        $this->fill([
            'refund_total' => round($this->refund_total + $amount, 2),
            'grand_total' => round($this->grand_total - $amount, 2),
        ]);

        $this->save();
    }

    public function allPayments(): HasMany
    {
        return $this->hasMany(OrderPayment::class)
            ->whereIn('type', [OrderPayment::TYPE_ORDER_PAYMENT, OrderPayment::TYPE_EXTRA_CHARGE]);
    }
}
