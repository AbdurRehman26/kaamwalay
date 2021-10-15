<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PopReportsSeries extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['card_series_id'];

    public function cardSeries(): HasOne
    {
        return $this->hasOne(CardSeries::class, 'id', 'card_series_id');
    }
}
