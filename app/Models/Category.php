<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable= [
        'name',
    ];

    public function series(){
        return $this->hasMany(Serie::class);
    }

    public function sets(){
        return $this->hasMany(Set::class);
    }

    public function cardProducts(){
        return $this->hasMany(cardProduct::class);
    }

}
