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
        'email',
        'amount',
        'initiated_at',
        'completed_at',
        'request_payload',
        'response_payload',
        'payout_status_id',
        'paid_by',
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
}
