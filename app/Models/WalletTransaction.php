<?php

namespace App\Models;

use App\Enums\Wallet\WalletTransactionReason;
use App\Enums\Wallet\WalletTransactionType;
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
        'type' => WalletTransactionType::class,
        'reason' => WalletTransactionReason::class,
    ];

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
