<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CardSeries extends Model
{
    use HasFactory;

    protected $fillable= [
        'name',
        'image_path',
        'image_bucket_path',
        'card_category_id',
    ];

    public function cardSets(){
        return $this->hasMany(CardSet::class);
    }

    public function cardCategory(){
        return $this->belongsTo(CardCategory::class);
    }
}
