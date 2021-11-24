<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentPlan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['price', 'price_before_discount', 'discount_percentage', 'max_protection_amount', 'turnaround', 'display_position'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
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
