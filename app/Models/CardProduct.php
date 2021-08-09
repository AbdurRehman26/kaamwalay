<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
        'name',
        'rarity',
        'card_number',
        'set_name',
        'image_path',
        'card_url',
        'image_bucket_path',
        'card_number_order',
        'card_category_id',
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
     * Get the name of the index associated with the model.
     *
     * @return string
     */
    public function searchableAs()
    {
        return config('app.env'). '_' . $this->getTable();
    }

    // public function shouldBeSearchable()
    // {
    //     return $this->id < 1001;
    // }

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
            "card_category_name" => $this->cardCategory->name,
            "card_set_name" => $this->cardSet->name,
            "card_series_name" => $this->cardSet->cardSeries->name,
            "release_year" => $this->cardSet->release_year,
            "card_number_order" => is_numeric($this->card_number_order) ? \Str::padLeft($this->card_number_order, 3, '0') : $this->card_number_order,
            "image_path" => $this->image_path,
        ];

        return $array;
    }
    
    public function cardSet()
    {
        return $this->belongsTo(CardSet::class);
    }

    public function cardCategory()
    {
        return $this->belongsTo(CardCategory::class);
    }
}
