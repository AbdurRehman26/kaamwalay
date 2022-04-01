<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'is_enabled', 'is_visible'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
    ];

    public function scopeEnabled(Builder $query): Builder
    {
        return $query->where('is_enabled', 1);
    }

    public function isCollectorCoin(): bool
    {
        return $this->code === 'collector_coin';
    }
    
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }

    public static function getWalletPaymentMethod(): self
    {
        return PaymentMethod::where('code', 'wallet')->first();
    }

    public function isWallet(): bool
    {
        return $this->code === 'wallet';
    }
}
