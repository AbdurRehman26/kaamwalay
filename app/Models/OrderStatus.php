<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatus extends Model
{
    use HasFactory;

    public const STATUSES = [
        'payment_pending' => 1,
        'placed' => 2,
    ];

    public const DEFAULT_ORDER_STATUS = self::STATUSES['payment_pending'];
    public const IS_ARRIVED_ORDER_STATUSES = [
        'payment_pending' => 1,
        'placed' => 2,
        'cancelled' => 6,
    ];


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description', 'order_state_id'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'order_state_id' => 'integer',
    ];

    public function orderState()
    {
        return $this->belongsTo(\App\Models\OrderState::class);
    }
}
