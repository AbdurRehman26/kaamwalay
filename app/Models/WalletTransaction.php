<?php

namespace App\Models;

use App\Casts\WalletTransactionReason;
use App\Casts\WalletTransactionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'user_id',
        'order_id',
        'wallet_payment_id',
        'type',
        'reason',
        'is_success',
    ];
    protected $casts = [
        'type' => WalletTransactionType::class,
        'reason' => WalletTransactionReason::class,
        'is_success' => 'boolean',
    ];
}
