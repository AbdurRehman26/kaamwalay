<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Serie extends Model
{
    use HasFactory;

    protected $table = 'series';

    protected $fillable= [
        'name',
        'image_path',
        'image_bucket_path',
        'category_id',
    ];

    public function sets(){
        return $this->hasMany(Set::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }
}
