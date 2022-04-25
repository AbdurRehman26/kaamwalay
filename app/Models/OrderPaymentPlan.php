<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OrderPaymentPlan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['order_id', 'price', 'max_protection_amount', 'turnaround'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'price' => 'float',
        'turnaround' => 'string',
        'max_protection_amount' => 'float',
    ];

    /**
     * @return HasOne<Order>
     */
    public function order(): HasOne
    {
        return $this->hasOne(Order::class);
    }
}
