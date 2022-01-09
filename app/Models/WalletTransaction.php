<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
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
    const REASON_WALLET_CREDIT = 'wallet_credit_by_admin';
    const REASON_WALLET_PAYMENT = 'wallet_credit_by_user';

    protected $fillable = [
        'wallet_id',
        'created_by',
        'order_id',
        'wallet_payment_id',
        'amount',
        'type',
        'reason',
        'is_success',
    ];

    protected $casts = [
        'amount' => 'float',
        'is_success' => 'boolean',
    ];

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    protected function type(): Attribute
    {
        return new Attribute(
            get: fn ($value) => (match ((int) $value) {
                1 => 'credit',
                default => 'debit',
            }),
            set: fn ($value) => (match ($value) {
                'credit' => 1,
                default => 2,
            }),
        );
    }

    protected function reason(): Attribute
    {
        return new Attribute(
            get: fn ($value) => (match ((int) $value) {
                1 => WalletTransaction::REASON_ORDER_PAYMENT,
                2 => WalletTransaction::REASON_REFUND,
                3 => WalletTransaction::REASON_WALLET_CREDIT,
                default => 'wallet_payment',
            }),
            set: fn ($value) => (match ($value) {
                WalletTransaction::REASON_ORDER_PAYMENT => 1,
                WalletTransaction::REASON_REFUND => 2,
                WalletTransaction::REASON_WALLET_CREDIT => 3,
                default => 4,
            }),
        );
    }
}
