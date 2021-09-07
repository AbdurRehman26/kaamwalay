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
        'ai_model_numbers',
        'front_centering_img_src',
        'front_surface_img_src',
        'front_edges_img_src',
        'front_corners_img_src',
        'back_centering_img_src',
        'back_surface_img_src',
        'back_edges_img_src',
        'back_corners_img_src',
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

    public function userCardCertificate(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(\App\Models\UserCardCertificate::class);
    }
}
