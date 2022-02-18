<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardRarity extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'card_category_id',
        'name',
    ];

    public function cardCategory(): BelongsTo
    {
        return $this->belongsTo(CardCategory::class);
    }
}
