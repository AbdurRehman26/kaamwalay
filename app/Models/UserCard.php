<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_item_id',
        'user_id',
        'human_grade_values',
        'robo_grade_values',
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
        'human_grade_values' => 'array',
        'robo_grade_values' => 'array',
        'overall_values' => 'array',
    ];

    public const IMAGE_FIELDS = [
        'front_centering_img_src',
        'front_surface_img_src',
        'front_edges_img_src',
        'front_corners_img_src',
        'back_centering_img_src',
        'back_surface_img_src',
        'back_edges_img_src',
        'back_corners_img_src',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function userCardCertificate(): HasOne
    {
        return $this->hasOne(UserCardCertificate::class);
    }
}
