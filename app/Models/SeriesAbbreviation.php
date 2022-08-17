<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class SeriesAbbreviation extends Model
{
    use HasFactory;

    public function scopeCategory(Builder $query, CardCategory $category)
    {
        $query->where('card_category_id', $category->id);
    }

    public function scopeLanguage(Builder $query, string $language)
    {
        $query->where('language', $language);
    }
}
