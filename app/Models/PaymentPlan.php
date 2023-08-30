<?php

namespace App\Models;

use App\Concerns\Coupons\CanHaveCoupons;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentPlan extends Model
{
    use CanHaveCoupons, HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['price', 'price_before_discount', 'discount_percentage', 'max_protection_amount', 'turnaround', 'display_position', 'estimated_delivery_days_min', 'estimated_delivery_days_max'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'price' => 'float',
        'price_before_discount' => 'float',
        'discount_percentage' => 'string',
        'turnaround' => 'string',
        'max_protection_amount' => 'float',
        'display_position' => 'integer',
        'estimated_delivery_days_min' => 'integer',
        'estimated_delivery_days_max' => 'integer',
    ];

    /**
     * @return HasMany<PaymentPlanRange>
     */
    public function paymentPlanRanges(): HasMany
    {
        return $this->hasMany(PaymentPlanRange::class)->orderBy('price', 'DESC');
    }
}
