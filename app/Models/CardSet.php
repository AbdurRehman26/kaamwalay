<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CardSet extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'card_series_id',
        'card_category_id',
        'name',
        'description',
        'cards_number',
        'secret_cards',
        'release_date',
        'release_date_formatted',
        'release_year',
        'image_path',
        'image_bucket_path',
        'set_url',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'release_date' => 'date',
    ];

    public function cardSeries(): BelongsTo
    {
        return $this->belongsTo(CardSeries::class);
    }

    public function cardProducts(): HasMany
    {
        return $this->hasMany(CardProduct::class);
    }

    public function cardCategory(): BelongsTo
    {
        return $this->belongsTo(CardCategory::class);
    }
}
