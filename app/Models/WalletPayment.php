<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_method_id',
        'wallet_id',
        'request',
        'response',
        'amount',
        'payment_provider_reference_id',
    ];

    protected $casts = [
        'request' => 'array',
        'response' => 'array',
        'amount' => 'float',
    ];

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
