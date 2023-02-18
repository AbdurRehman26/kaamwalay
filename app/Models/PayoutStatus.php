<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayoutStatus extends Model
{
    use HasFactory;

    const STATUS_PENDING = 0;
    const STATUS_COMPLETED = 1;
    const STATUS_FAILED = 2;

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
}
