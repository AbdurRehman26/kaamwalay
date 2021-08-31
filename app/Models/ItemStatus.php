<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemStatus extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'order_item_status_id',
        'order_item_id',
        'notes',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'order_item_status_id' => 'integer',
        'order_item_id' => 'integer',
    ];

    public function orderItem()
    {
        return $this->belongsTo(\App\Models\OrderItem::class);
    }

    public function orderItemStatus()
    {
        return $this->belongsTo(\App\Models\OrderItemStatus::class);
    }
}
