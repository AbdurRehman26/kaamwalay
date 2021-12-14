<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CouponLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'couponable_id',
        'coupon_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function couponable(): BelongsTo
    {
        return $this->belongsTo(Couponable::class);
    }
}
