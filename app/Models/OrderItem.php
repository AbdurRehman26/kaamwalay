<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property OrderItemStatus $orderItemStatus
 * @property int $order_item_status_id
 * @property int $order_id
 * @property int $id
 * @property UserCard $userCard
 */
class OrderItem extends Model
{
    use HasFactory;

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
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'declared_value_per_unit' => 'float',
        'declared_value_total' => 'float',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function cardProduct()
    {
        return $this->belongsTo(CardProduct::class);
    }

    public function orderItemShipment()
    {
        return $this->belongsTo(OrderItemShipment::class);
    }

    public function orderItemCustomerShipment()
    {
        return $this->belongsTo(OrderItemCustomerShipment::class);
    }

    public function orderItemStatus()
    {
        return $this->belongsTo(OrderItemStatus::class);
    }

    public function orderItemStatusHistories()
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
}
