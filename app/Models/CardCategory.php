<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CardCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'image_url', 'is_enabled',
    ];

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
}
