<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CouponStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'coupon_status_id',
        'coupon_id',
        'notes',
    ];

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function couponStatus(): BelongsTo
    {
        return $this->belongsTo(CouponStatus::class);
    }
}
