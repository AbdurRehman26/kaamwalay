<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardLabel extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'card_product_id',
        'line_one',
        'line_two',
        'line_three',
        'line_four',
    ];

    /**
     * @return BelongsTo<CardProduct, CardLabel>
     */
    public function cardProduct(): BelongsTo
    {
        return $this->belongsTo(CardProduct::class);
    }
}
