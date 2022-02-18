<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CardCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
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
}
