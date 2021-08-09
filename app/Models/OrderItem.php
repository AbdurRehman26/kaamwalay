<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'declared_value_per_unit' => 'decimal:2',
        'declared_value_total' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(\App\Models\Order::class);
    }

    public function cardProduct()
    {
        return $this->belongsTo(\App\Models\CardProduct::class);
    }

    public function orderItemShipment()
    {
        return $this->belongsTo(\App\Models\OrderItemShipment::class);
    }
}
