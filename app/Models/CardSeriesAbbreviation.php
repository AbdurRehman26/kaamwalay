<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CardSeriesAbbreviation extends Model
{
    use HasFactory;

    /**
     * @param  Builder <CardSeriesAbbreviation> $query
     * @return Builder <CardSeriesAbbreviation>
     */
    public function scopeCategory(Builder $query, CardCategory $category): Builder
    {
        return $query->where('card_category_id', $category->id);
    }

    /**
     * @param  Builder <CardSeriesAbbreviation> $query
     * @return Builder <CardSeriesAbbreviation>
     */
    public function scopeLanguage(Builder $query, string $language): Builder
    {
        return $query->where('language', $language);
    }
}
