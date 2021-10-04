<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CardSeries extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_category_id',
        'name',
        'image_path',
        'image_bucket_path',
    ];

    public function cardSets(): HasMany
    {
        return $this->hasMany(CardSet::class);
    }

    public function cardCategory(): BelongsTo
    {
        return $this->belongsTo(CardCategory::class);
    }
}
