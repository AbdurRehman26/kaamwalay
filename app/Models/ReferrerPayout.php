<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReferrerPayout extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payout_account',
        'payment_method',
        'amount',
        'initiated_at',
        'completed_at',
        'request_payload',
        'response_payload',
        'payout_status_id',
        'paid_by',
        'transaction_id',
        'transaction_status',
    ];

    const PAYMENT_METHODS = [
        'PAYPAL',
    ];

    /**
     * @return BelongsTo<User, ReferrerPayout>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<User, ReferrerPayout>
     */
    public function paidBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'paid_by');
    }

    /**
     * @return BelongsTo<PayoutStatus, ReferrerPayout>
     */
    public function payoutStatus(): BelongsTo
    {
        return $this->belongsTo(PayoutStatus::class, 'payout_status_id');
    }
}
