<?php

namespace App\Models;

use App\Concerns\ActivityLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OrderItem extends Model
{
    use HasFactory, ActivityLog;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'order_id',
        'card_product_id',
        'order_item_shipment_id',
        'order_item_customer_shipment_id',
        'order_item_status_id',
        'grading_id',
        'quantity',
        'unit_price',
        'total_price',
        'name',
        'description',
        'declared_value_per_unit',
        'declared_value_total',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'order_id' => 'integer',
        'card_product_id' => 'integer',
        'order_item_shipment_id' => 'integer',
        'order_item_customer_shipment_id' => 'integer',
        'order_item_status_id' => 'integer',
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'declared_value_per_unit' => 'float',
        'declared_value_total' => 'float',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function cardProduct(): BelongsTo
    {
        return $this->belongsTo(CardProduct::class);
    }

    public function orderItemShipment(): BelongsTo
    {
        return $this->belongsTo(OrderItemShipment::class);
    }

    public function orderItemCustomerShipment(): BelongsTo
    {
        return $this->belongsTo(OrderItemCustomerShipment::class);
    }

    public function orderItemStatus(): BelongsTo
    {
        return $this->belongsTo(OrderItemStatus::class);
    }

    public function orderItemStatusHistory(): HasMany
    {
        return $this->hasMany(OrderItemStatusHistory::class);
    }

    public function userCard(): HasOne
    {
        return $this->hasOne(UserCard::class);
    }

    public function scopeForOrder(Builder $query, Order $order): Builder
    {
        return $query->where('order_id', $order->id);
    }

    public function isValidForGrading(): bool
    {
        return $this->order_item_status_id === OrderItemStatus::CONFIRMED;
    }
}
