<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'order_number',
        'shipping_fee',
        'grand_total',
        'user_id',
        'payment_plan_id',
        'order_status_id',
        'shipping_order_address_id',
        'billing_order_address_id',
        'payment_method_id',
        'shipping_method_id',
        'invoice_id',
        'arrived_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'shipping_fee' => 'float',
        'grand_total' => 'float',
        'user_id' => 'integer',
        'payment_plan_id' => 'integer',
        'order_status_id' => 'integer',
        'order_address_id' => 'integer',
        'shipping_order_address_id' => 'integer',
        'billing_order_address_id' => 'integer',
        'payment_method_id' => 'integer',
        'shipping_method_id' => 'integer',
        'invoice_id' => 'integer',
        'arrived_at' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function paymentPlan()
    {
        return $this->belongsTo(\App\Models\PaymentPlan::class);
    }

    public function orderStatus()
    {
        return $this->belongsTo(\App\Models\OrderStatus::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(\App\Models\OrderAddress::class, 'shipping_order_address_id');
    }

    public function billingAddress()
    {
        return $this->belongsTo(\App\Models\OrderAddress::class, 'billing_order_address_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(\App\Models\PaymentMethod::class);
    }

    public function shippingMethod()
    {
        return $this->belongsTo(\App\Models\ShippingMethod::class);
    }

    public function invoice()
    {
        return $this->belongsTo(\App\Models\Invoice::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeForUser(Builder $query, User $user): Builder
    {
        return $query->where('user_id', $user->id);
    }
}
