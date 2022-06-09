<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShippingMatrix extends Model
{
    use HasFactory;

    protected $fillable = ['country_id', 'box_default_value', 'slip_default_value'];

    protected $casts = [
        'id' => 'integer',
        'country_id' => 'integer',
        'box_default_value' => 'float',
        'slip_default_value' => 'float',
    ];

    /**
     * @return BelongsTo<Country, ShippingMatrix>
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
