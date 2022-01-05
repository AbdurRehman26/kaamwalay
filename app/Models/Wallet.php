<?php

namespace App\Models;

use App\Events\Wallet\TransactionHappened;
use App\Events\Wallet\WalletCreated;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Wallet extends Model
{
    use HasFactory;

    const ACTIVE = 1;

    protected $fillable = [
        'user_id',
        'balance',
        'is_active',
    ];

    protected $casts = [
        'balance' => 'float',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function walletPayments(): HasMany
    {
        return $this->hasMany(WalletPayment::class);
    }

    public function walletTransactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function lastTransaction(): HasOne
    {
        return $this->hasOne(WalletTransaction::class)->latestOfMany();
    }

    public function scopeForCurrentUser(Builder $query): Builder
    {
        return $query->whereUserId(auth()->user()->id);
    }

    public function scopeIsActive(Builder $query): Builder
    {
        return $query->whereIsActive(self::ACTIVE);
    }

    public function createWallet(array $attributes)
    {
        event(new WalletCreated($attributes));
    }

    public function makeTransaction(float $amount, string $reason, int $userId, ?Order $order = null)
    {
        event(new TransactionHappened(
            $this->id,
            $amount,
            $reason,
            $userId,
            $order?->id,
        ));
    }
}
