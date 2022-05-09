<?php

namespace App\Models;

use App\Concerns\Coupons\CanHaveCoupons;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentPlan extends Model
{
    use HasFactory, CanHaveCoupons, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['price', 'price_before_discount', 'discount_percentage', 'max_protection_amount', 'turnaround', 'display_position'];

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
    ];
}
