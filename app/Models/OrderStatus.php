<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $code
 */
class OrderStatus extends Model
{
    use HasFactory;

    public const PAYMENT_PENDING = 1;
    public const PLACED = 1;

    public const DEFAULT_ORDER_STATUS = self::PAYMENT_PENDING;

    public const STATUSES = [
        'payment_pending' => self::PAYMENT_PENDING,
        'placed' => self::PLACED,
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

    public function orderState(): BelongsTo
    {
        return $this->belongsTo(OrderState::class);
    }
}
