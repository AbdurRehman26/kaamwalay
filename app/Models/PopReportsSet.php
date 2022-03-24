<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PopReportsSet extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['card_set_id', 'card_series_id'];

    protected $casts = [
        'release_date' => 'date',
    ];

    /**
     * @return BelongsTo<CardSet, PopReportsSet>
     */
    public function cardSet(): BelongsTo
    {
        return $this->belongsTo(CardSet::class);
    }
}
