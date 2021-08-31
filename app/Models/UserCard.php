<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_item_id',
        'user_id',
        'front_values',
        'back_values',
        'overall_values',
        'overall_grade',
        'certificate_number',
        'ai_model_number',
    ];

    protected $casts = [
        'order_item_id' => 'integer',
        'user_id' => 'integer',
        'overall_grade' => 'float',
    ];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function orderItem(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\OrderItem::class);
    }
}
