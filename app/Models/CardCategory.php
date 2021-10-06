<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CardCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function cardSeries()
    {
        return $this->hasMany(CardSeries::class);
    }

    public function cardSets()
    {
        return $this->hasMany(CardSet::class);
    }

    public function cardProducts()
    {
        return $this->hasMany(CardProduct::class);
    }
}
