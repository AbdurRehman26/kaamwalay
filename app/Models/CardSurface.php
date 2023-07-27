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

    /**
     * @param  Builder <CardSurface>  $query
     * @return Builder <CardSurface>
     */
    public function scopeCardCategory(Builder $query, int $categoryId): Builder
    {
        return $query->whereHas(
            'cardCategory',
            fn (Builder $subQuery) => $subQuery->where('card_categories.id', $categoryId)
        );
    }

    /**
     * @param  Builder <CardSurface>  $query
     * @return Builder <CardSurface>
     */
    public function scopeSearch(Builder $query, string $value): Builder
    {
        return $query->whereLike(
            [
                'name',
            ],
            $value
        );
    }
}
