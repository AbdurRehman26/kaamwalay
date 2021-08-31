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
        'order_item_customer_shipment_id',
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
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'declared_value_per_unit' => 'float',
        'declared_value_total' => 'float',
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

    public function orderItemCustomerShipment()
    {
        return $this->belongsTo(\App\Models\OrderItemCustomerShipment::class);
    }

    // public function markAsMissing(): self
    // {
    //     $this->order_status_id = 1;
    //     $this->save();

    //     return $this;
    // }

    // public function markAsNotAccepted(): self
    // {
    //     $this->order_status_id = 2;
    //     $this->save();

    //     return $this;
    // }

    // public function markAsConfirmed(): self
    // {
    //     $this->order_status_id = 3;
    //     $this->save();

    //     return $this;
    // }

    // public function markAsGraded(): self
    // {
    //     $this->order_status_id = 4;
    //     $this->save();

    //     return $this;
    // }
}
