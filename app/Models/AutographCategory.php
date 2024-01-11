<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AutographCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function autographProducts(): HasMany
    {
        return $this->hasMany(AutographProduct::class, 'autograph_category_id');
    }
}
