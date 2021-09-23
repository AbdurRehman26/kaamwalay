<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static OrderItemShipment create(?array $data = [])
 */
class OrderItemShipment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['shipment_date', 'tracking_number', 'tracking_url', 'shipping_method_id', 'shipping_provider'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'shipment_date' => 'datetime',
        'shipping_method_id' => 'integer',
    ];

    public function shippingMethod()
    {
        return $this->belongsTo(\App\Models\ShippingMethod::class);
    }
}
