<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Set extends Model
{
    use HasFactory;

    protected $table = 'sets';

    protected $fillable= [
        'id',
        'serie_id',
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
        'category_id',
    ];

    public function serie(){
        return $this->belongsTo(Serie::class);
    }

    public function cardProducts(){
        return $this->hasMany(CardProduct::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }
}
