<?php

namespace App\Models;

use App\Enums\Wallet\WalletTransactionReason;
use App\Enums\Wallet\WalletTransactionType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTransaction extends Model
{
    use HasFactory;

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
            get: fn ($value) => (WalletTransactionType::from($value)->toString()),
            set: fn (WalletTransactionType $type) => ($type->value),
        );
    }

    protected function reason(): Attribute
    {
        return new Attribute(
            get: fn ($value) => (match ((int) $value) {
                1 => WalletTransactionReason::ORDER_PAYMENT->value,
                2 => WalletTransactionReason::REFUND->value,
                3 => WalletTransactionReason::WALLET_CREDIT->value,
                default => WalletTransactionReason::WALLET_PAYMENT->value,
            }),
            set: fn ($value) => (match ($value) {
                WalletTransactionReason::ORDER_PAYMENT->value => 1,
                WalletTransactionReason::REFUND->value => 2,
                WalletTransactionReason::WALLET_CREDIT->value => 3,
                default => 4,
            }),
        );
    }
}
