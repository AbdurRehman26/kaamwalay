<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class CardProduct extends Model
{
    use HasFactory;
    use Searchable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'card_set_id',
        'card_category_id',
        'name',
        'rarity',
        'card_number',
        'set_name',
        'image_path',
        'card_url',
        'image_bucket_path',
        'card_number_order',
        'edition',
        'surface',
        'variant',
        'card_id',
        'language',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */

    protected $casts = [
        'id' => 'integer',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = [
            "id" => $this->id,
            "name" => $this->name,
            "search_name" => $this->getSearchableName(),
            'log_name' => $this->getLongName(),
            "short_name" => $this->getShortName(),
            'full_name' => $this->getSearchableName(),
            "card_category_name" => $this->cardCategory->name,
            "card_set_name" => $this->cardSet->name,
            "card_series_name" => $this->cardSet->cardSeries->name,
            "release_year" => $this->cardSet->release_year,
            "card_number_order" => is_numeric($this->card_number_order) ? Str::padLeft($this->card_number_order, 3, '0') : $this->card_number_order,
            "image_path" => $this->image_path,
            "variant_name" => $this->variant_name,
            "variant_category" => $this->variant_category,
            "holo_type" => $this->holo_type,
        ];

        return $array;
    }

    public function cardSet(): BelongsTo
    {
        return $this->belongsTo(CardSet::class);
    }

    public function cardCategory(): BelongsTo
    {
        return $this->belongsTo(CardCategory::class);
    }

    public function getFormattedCardNumber(): string
    {
        return is_numeric($this->card_number_order) ? Str::padLeft($this->card_number_order, 3, '0') : $this->card_number_order;
    }

    public function getShortName(): string
    {
        $language = $this->language == 'English' ? $this->language . ' ' : '';
        $edition = $this->edition ? $this->edition . ' ' : '';
        $surface = $this->surface ? $this->surface . ' ' : '';
        $variant = $this->variant ? $this->variant . ' ' : '';

        return $language . $edition . $surface . $variant;
    }

    public function getLongName(): string
    {
        $series = $this->cardSet->cardSeries->name == $this->cardSet->name ? '' :  $this->cardSet->cardSeries->name . ' ';

        return $this->cardSet->release_year . ' ' . $this->cardCategory->name . ' ' . $series . $this->cardSet->name . ' ' . $this->card_number_order;
    }

    public function getSearchableName(): string
    {
        return $this->cardSet->release_year . ' ' . $this->cardCategory->name . ' ' . $this->cardSet->cardSeries->name . ' ' . $this->cardSet->name . ' ' . $this->getFormattedCardNumber() . ' ' . $this->getShortName() . ' ' . $this->name;
    }
}
