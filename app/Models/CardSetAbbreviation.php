<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CardSetAbbreviation extends Model
{
    use HasFactory;

    /**
     * @param  Builder  <CardSetAbbreviation>  $query
     * @return Builder <CardSetAbbreviation>
     */
    public function scopeCategory(Builder $query, CardCategory $category): Builder
    {
        return $query->where('card_category_id', $category->id);
    }

    /**
     * @param  Builder <CardSetAbbreviation>  $query
     * @return Builder <CardSetAbbreviation>
     */
    public function scopeLanguage(Builder $query, string $language): Builder
    {
        return $query->where('language', $language);
    }
}
