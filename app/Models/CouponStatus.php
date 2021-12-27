<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CouponStatus extends Model
{
    use HasFactory;

    const STATUS_QUEUED = 1;
    const STATUS_ACTIVE = 2;
    const STATUS_INACTIVE = 3;
    const STATUS_EXPIRED = 4;

    protected $fillable = [
        'code',
        'name',
        'description',
    ];

    public function scopeForStatus(Builder $query, int|string $status): Builder
    {
        return $query
            ->where('id', $status)
            ->orWhere('code', $status);
    }

    public function couponStatusHistories(): HasMany
    {
        return $this->hasMany(CouponStatusHistory::class);
    }
}
