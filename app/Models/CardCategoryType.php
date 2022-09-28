<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CardCategoryType extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * @return HasMany<CardCategory>
     */
    public function cardCategories(): HasMany
    {
        return $this->hasMany(CardCategory::class);
    }
}
