<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderPayment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'order_id',
        'payment_method_id',
        'request',
        'response',
        'payment_provider_reference_id',
        'notes',
        'amount',
        'type',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'provider_fee' => 'float',
        'type' => 'integer',
        'amount' => 'float',
    ];

    public const PAYMENT_TYPES = [
        'order_payment' => 1,
        'extra_charge' => 2,
        'refund' => 3,
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
