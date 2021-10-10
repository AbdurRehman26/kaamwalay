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
}
