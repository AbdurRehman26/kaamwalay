<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function cardSeries()
    {
        return $this->belongsTo(CardSeries::class);
    }

    public function cardProducts()
    {
        return $this->hasMany(CardProduct::class);
    }

    public function cardCategory()
    {
        return $this->belongsTo(CardCategory::class);
    }
}
