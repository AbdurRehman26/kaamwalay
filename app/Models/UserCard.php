<?php

namespace App\Models;

use App\Concerns\ActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Scout\Searchable;

class UserCard extends Model
{
    use HasFactory, ActivityLog, Searchable;

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
        'grade_delta',
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
        'grade_delta' => 'float',
    ];

/**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = [
            'id' => $this->order_item_id,
            'card_name' => $this->orderItem->cardProduct->name,
            'card_image' => $this->orderItem->cardProduct->image_path,
            'searchable_name' => $this->getSearchableName(),
            'graded_at' => $this->graded_at,
            'certificate_number' => $this->certificate_number,
            'owner_name' => $this->user->getFullName(),
            'grade_nickname' => $this->overall_grade_nickname,
            'overall_grade' => $this->overall_grade,
            'card_category' => $this->orderItem->cardProduct->cardCategory->name,
        ];

        return $array;
    }

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
    
    public function isCardInformationComplete(): bool
    {
        return $this->orderItem->cardProduct->card_category_id && 
        $this->orderItem->cardProduct->card_set_id && ! is_null($this->orderItem->cardProduct->card_number_order);
    }

    public function getShortName(): string
    {
        if ($this->isCardInformationComplete()) {
            $language = $this->orderItem->cardProduct->language !== 'English' ? $this->language . ' - ' : '';
            $edition = $this->orderItem->cardProduct->edition !== 'Unlimited' ? $this->edition . ' - ' : '';
            $surface = $this->orderItem->cardProduct->surface ? $this->surface . ' - ' : '';
            $variant = $this->orderItem->cardProduct->variant ?: '';

            $shortName = $language . $edition . $surface . $variant;

            if (str_ends_with($shortName, ' - ')) {
                $shortName = substr_replace($shortName, '', -3);
            }

            return $shortName;
        }

        return 'Added Manually';
    }

    public function getLongName(): string
    {
        if ($this->isCardInformationComplete()) {
            $series =  $this->orderItem->cardProduct->cardSet->cardSeries->name ==  $this->orderItem->cardProduct->cardSet->name ? '' 
            :   $this->orderItem->cardProduct->cardSet->cardSeries->name . ' ';

            return  $this->orderItem->cardProduct->cardSet->release_year . ' ' 
            .  $this->orderItem->cardProduct->cardCategory->name . ' ' . $series . 
            $this->orderItem->cardProduct->cardSet->name . ' ' .  $this->orderItem->cardProduct->card_number_order;
        }

        return  $this->orderItem->cardProduct->description;
    }

    public function getSearchableName(): string
    {
        return $this->getLongName() . ' ' . $this->getShortName() . ' ' .  $this->orderItem->cardProduct->name;
    }
}
