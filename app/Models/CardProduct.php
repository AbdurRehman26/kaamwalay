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
    protected $fillable= [
        'set_id',
        'name',
        'rarity',
        'card_number',
        'set_name',
        'image_path',
        'card_url',
        'image_bucket_path',
        'card_number_order',
        'category_id',
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
            "category_id" => $this->category_id,
            "category_name" => $this->category->name,
            "set_id" => $this->set_id,
            "set_name" => $this->set->name,
            "serie_id" => $this->set->serie_id,
            "serie_name" => $this->set->serie->name,
            "release_date" => $this->set->release_date,
            "release_year" => $this->set->release_year,
            "rarity" => $this->rarity,
            "card_number" => $this->card_number,
            "card_number_order" => $this->card_number_order,
            "image_path" => $this->image_path,
            "image_bucket_path" => $this->image_bucket_path,
            "card_url" => $this->card_url,
        ];

        return $array;
    }
    
    public function set(){
        return $this->belongsTo(Set::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }
}
