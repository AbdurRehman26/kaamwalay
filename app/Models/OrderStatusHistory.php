<?php

namespace App\Models;

use App\Concerns\ActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\QueryBuilder\AllowedInclude;

class OrderStatusHistory extends Model
{
    use ActivityLog, HasFactory;

    protected $fillable = [
        'order_id',
        'order_status_id',
        'user_id',
        'notes',
        'created_at',
    ];

    protected $casts = [
        'order_id' => 'integer',
        'order_status_id' => 'integer',
        'user_id' => 'integer',
    ];

    public static function getAllowedAdminIncludes(): array
    {
        return [
            AllowedInclude::relationship('user'),
            AllowedInclude::relationship('order'),
            AllowedInclude::relationship('orderStatus'),
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderStatus(): BelongsTo
    {
        return $this->belongsTo(OrderStatus::class);
    }
}
