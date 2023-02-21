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
        'referrer_payout_status_id',
        'paid_by',
        'transaction_id',
        'transaction_status',
    ];

    public const DEFAULT_PAYMENT_METHOD = 'paypal';

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
     * @return BelongsTo<ReferrerPayoutStatus, ReferrerPayout>
     */
    public function referrerPayoutStatus(): BelongsTo
    {
        return $this->belongsTo(ReferrerPayoutStatus::class);
    }
}
