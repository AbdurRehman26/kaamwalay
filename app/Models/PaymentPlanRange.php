<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentPlanRange extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['payment_plan_id', 'price', 'min_cards', 'max_cards'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'payment_plan_id' => 'integer',
        'price' => 'float',
        'min_cards' => 'integer',
        'max_cards' => 'integer',
    ];

    /**
     * @return BelongsTo<PaymentPlan, PaymentPlanRange>
     */
    public function paymentPlan(): BelongsTo
    {
        return $this->belongsTo(PaymentPlan::class);
    }
}
