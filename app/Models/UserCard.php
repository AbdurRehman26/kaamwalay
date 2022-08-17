<?php

namespace App\Models;

use App\Concerns\ActivityLog;
use App\Enums\UserCard\UserCardShippingStatus;
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
        'shipping_status',
        'is_fake',
        'social_images'
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
        'shipping_status' => UserCardShippingStatus::class,
        'is_fake' => 'boolean',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        return [
            'id' => $this->order_item_id,
            'card_name' => $this->orderItem->cardProduct->name,
            'card_image' => $this->orderItem->cardProduct->image_path,
            'searchable_name' => $this->orderItem->cardProduct->getSearchableName(),
            'certificate_number' => $this->certificate_number,
            'owner_name' => $this->user->username,
            'grade_nickname' => $this->overall_grade_nickname,
            'grade_overall' => $this->overall_grade,
            'card_category' => $this->orderItem->cardProduct->cardCategory->name,
            'grade' => $this->overall_grade_nickname .' '. $this->overall_grade,
            'shipped_at' => $this->orderItem->order->shipped_at,
        ];
    }

    public function shouldBeSearchable(): bool
    {
        return (
            $this->orderItem->order_item_status_id === OrderItemStatus::GRADED
            && $this->orderItem->order->order_status_id === OrderStatus::SHIPPED
            && OrderItemStatusHistory::where('order_item_status_id', OrderItemStatus::GRADED)->exists()
        );
    }

    public function wasSearchableBeforeUpdate(): bool
    {
        return $this->shouldBeSearchable();
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

    /**
     * @return HasOne<VaultShipmentItem>
     */
    public function vaultShipmentItem(): HasOne
    {
        return $this->hasOne(VaultShipmentItem::class);
    }

    public function markAsShipped(): bool
    {
        $this->shipping_status = UserCardShippingStatus::SHIPPED;

        return $this->save();
    }

    public function storeInVault(): bool
    {
        $this->shipping_status = UserCardShippingStatus::IN_VAULT;

        return $this->save();
    }
}
