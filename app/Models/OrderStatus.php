<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderStatus extends Model
{
    use HasFactory;

    public const PAYMENT_PENDING = 1;
    public const PLACED = 2;
    public const CONFIRMED = 3;
    public const GRADED = 4;
    public const SHIPPED = 5;
    public const CANCELLED = 6;
    public const REVIEWED = 7;
    public const ASSEMBLED = 8;

    public const DEFAULT_ORDER_STATUS = self::PAYMENT_PENDING;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description', 'order_state_id'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
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
