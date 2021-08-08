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
     * Get the name of the index associated with the model.
     *
     * @return string
     */
    public function searchableAs()
    {
        return 'local_card_products';
    }

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
    ];

    public function set(){
        return $this->belongsTo(Set::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }
}
