<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CardCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'image_url', 'is_enabled', 'type', 'card_category_type_id',
    ];

    /**
     * @return BelongsTo<CardCategoryType, CardCategory>
     */
    public function cardCategoryType(): BelongsTo
    {
        return $this->belongsTo(CardCategoryType::class);
    }

    public function cardSeries(): HasMany
    {
        return $this->hasMany(CardSeries::class);
    }

    public function cardSets(): HasMany
    {
        return $this->hasMany(CardSet::class);
    }

    public function cardProducts(): HasMany
    {
        return $this->hasMany(CardProduct::class);
    }

    /**
     * @param  Builder <CardCategory> $query
     * @return Builder <CardCategory>
     */
    public function scopeEnabled(Builder $query): Builder
    {
        return $query->where('is_enabled', true);
    }

    /**
     * @return HasMany <CardRarity>
     */
    public function cardRarities(): HasMany
    {
        return $this->hasMany(CardRarity::class);
    }

    /**
     * @return HasMany <CardSurface>
     */
    public function cardSurfaces(): HasMany
    {
        return $this->hasMany(CardSurface::class);
    }

    /**
     * @return bool
     */
    public function isTCG(): bool
    {
        return $this->cardCategoryType->name === 'TCG';
    }

    /**
     * @return bool
     */
    public function isSports(): bool
    {
        return $this->cardCategoryType->name === 'Sports';
    }
}
