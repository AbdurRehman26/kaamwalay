<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItemStatus extends Model
{
    use HasFactory;

    public const PENDING = 1;
    public const MISSING = 2;
    public const NOT_ACCEPTED = 3;
    public const CONFIRMED = 4;
    public const GRADED = 5;
    public const CANCELLED = 6;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description', 'code'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
    ];

    public function scopeForStatus(Builder $query, $status): Builder
    {
        return $query
            ->where('id', $status)
            ->orWhere('code', $status);
    }
}
