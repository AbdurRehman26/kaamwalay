<?php

namespace App\Concerns\Order;

use App\Models\OrderPayment;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasOrderPayments
{
    public function firstOrderPayment(): HasOne
    {
        return $this->hasOne(OrderPayment::class)->oldestOfMany();
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
        return $this->hasMany(OrderPayment::class)
            ->where('type', OrderPayment::PAYMENT_TYPES['extra_charge']);
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(OrderPayment::class)->where('type', OrderPayment::PAYMENT_TYPES['refund']);
    }

    public function updateAfterExtraCharge(float $amount): void
    {
        $this->fill([
            'extra_charge' => $this->extra_charge + $amount,
            'grand_total' => $this->grand_total + $amount,
        ]);

        $this->save();
    }

    public function createOrderPayment(array $data)
    {
        $this->orderPayments()->create([
            'request' => json_encode($data['request']),
            'response' => json_encode($data['response']),
        ] + $data + ['payment_method_id' => $this->payment_method_id]);
    }

    public function updateAfterRefund(float $amount): void
    {
        $this->fill([
            'refund' => round($this->refund + $amount, 2),
            'grand_total' => round($this->grand_total - $amount, 2),
        ]);

        $this->save();
    }
}
