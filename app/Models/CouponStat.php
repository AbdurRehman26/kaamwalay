<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CouponStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'coupon_id',
        'times_used',
        'total_discount',
        'total_revenue',
        'total_cards',
    ];

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }
}
