<?php

namespace App\Models;

use App\Casts\WalletTransactionReason;
use App\Casts\WalletTransactionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTransaction extends Model
{
    use HasFactory;

    const TYPE_DEBIT = 'debit';
    const TYPE_CREDIT = 'credit';
    const REASON_REFUND = 'refund';
    const REASON_ORDER_PAYMENT = 'order_payment';
    const REASON_WALLET_CREDIT = 'wallet_credit'; // admin does the credit
    const REASON_WALLET_PAYMENT = 'wallet_payment'; // user does the credit
    protected $fillable = [
        'wallet_id',
        'initiated_by',
        'order_id',
        'wallet_payment_id',
        'amount',
        'type',
        'reason',
        'is_success',
    ];
    protected $casts = [
        'type' => WalletTransactionType::class,
        'reason' => WalletTransactionReason::class,
        'amount' => 'float',
        'is_success' => 'boolean',
    ];

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiated_by');
    }
}
