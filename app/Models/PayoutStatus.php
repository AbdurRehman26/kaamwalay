<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayoutStatus extends Model
{
    use HasFactory;

    const STATUS_PENDING = 1;
    const STATUS_PROCESSING = 2;
    const STATUS_COMPLETED = 3;
    const STATUS_FAILED = 4;

    protected $fillable = [
        'code',
        'name',
        'description',
    ];

    /**
     * @param  Builder <PayoutStatus> $query
     * @return Builder <PayoutStatus>
     */
    public function scopeForStatus(Builder $query, int|string $status): Builder
    {
        return $query
            ->where('id', $status)
            ->orWhere('code', $status);
    }
}
