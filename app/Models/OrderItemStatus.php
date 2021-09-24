<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @method static Builder forStatus(mixed $status)
 */
class OrderItemStatus extends Model
{
    use HasFactory;

    public const PENDING = 1;
    public const MISSING = 2;
    public const NOT_ACCEPTED = 3;
    public const CONFIRMED = 4;
    public const GRADED = 5;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description', 'code'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
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