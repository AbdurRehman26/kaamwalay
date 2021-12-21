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
        'times_used_till_date',
        'total_discount_given',
        'times_used_by_unique_users',
        'times_used_by_all_users',
        'total_revenue_generated',
    ];

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }
}
