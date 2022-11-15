<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesmanCommissionPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'salesman_id',
        'added_by',
        'amount',
        'notes',
        'file_url',
    ];

    /**
     * @return BelongsTo <User, SalesmanCommissionPayment>
     */
    public function salesman(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo <User, SalesmanCommissionPayment>
     */
    public function addedBy(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
