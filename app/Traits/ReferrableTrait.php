<?php

namespace App\Traits;

use App\Models\Referrer;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait ReferrableTrait
{
    /**
     * @return BelongsTo<User, User>
     */
    public function referredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    /**
     * @return HasOne<Referrer>
     */
    public function referrer(): HasOne
    {
        return $this->hasOne(Referrer::class, 'user_id', 'id');
    }
}
