<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $order_item_id
 * @property int $order_item_status_id
 * @property int $notes
 * @property int $user_id
 */
class OrderItemStatusHistory extends Model
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
        'user_id',
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
        'user_id' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(\App\Models\OrderItem::class);
    }

    public function orderItemStatus(): BelongsTo
    {
        return $this->belongsTo(\App\Models\OrderItemStatus::class);
    }
}