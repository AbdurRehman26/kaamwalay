<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardSurface extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'card_category_id',
        'name',
    ];

    /**
     * @return BelongsTo <CardCategory,CardSurface>
     */
    public function cardCategory(): BelongsTo
    {
        return $this->belongsTo(CardCategory::class);
    }

    public function scopeCardCategory(Builder $query, int $categoryId): Builder
    {
        return $query->whereHas(
            'cardCategory',
            fn (Builder $subQuery) => $subQuery->where('card_categories.id', $categoryId)
        );
    }
}
