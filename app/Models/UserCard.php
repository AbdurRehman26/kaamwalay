<?php

namespace App\Models;

use App\Concerns\ActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserCard extends Model
{
    use HasFactory, ActivityLog;

    protected $fillable = [
        'order_item_id',
        'user_id',
        'human_grade_values',
        'robo_grade_values',
        'overall_values',
        'overall_grade',
        'overall_grade_nickname',
        'ai_model_numbers',
        'generated_images',
        'grading_id',
        'certificate_number',
    ];

    protected $casts = [
        'order_item_id' => 'integer',
        'user_id' => 'integer',
        'overall_grade' => 'float',
        'human_grade_values' => 'array',
        'robo_grade_values' => 'array',
        'overall_values' => 'array',
        'generated_images' => 'array',
        'graded_at' => 'datetime',
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

    public function getRoundedOverallValues()
    {
        return ! is_null($this->overall_values) ? array_map(function ($v) {
            return round($v, 1);
        }, $this->overall_values) : $this->overall_values;
    }

    public function updateFromAgsResponse(array $response): void
    {
        if (! empty($response)) {
            $this->update($response);
        }
    }
}
