<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Referrer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'referral_code',
        'withdrawable_commission',
        'link_clicks',
        'successful_signups',
        'referral_orders',
        'is_referral_active',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'withdrawable_commission' => 'float',
        'link_clicks' => 'integer',
        'successful_signups' => 'integer',
        'referral_orders' => 'integer',
        'is_referral_active' => 'integer',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<User, Referrer>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<User>
     */
    public function referees(): HasMany
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<ReferrerEarnedCommission>
     */
    public function earnedCommissions(): HasMany
    {
        return $this->hasMany(ReferrerEarnedCommission::class);
    }
}
