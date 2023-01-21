<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Referrer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'referral_code',
        'withdrawable_commission',
        'link_clicks',
        'successful_signups',
        'commission_earnings',
        'sales_total',
        'total_earned',
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
        'commission_earnings' => 'integer',
        'sales_total' => 'float',
        'total_earned' => 'float',
        'is_referral_active' => 'boolean',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<User>
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
