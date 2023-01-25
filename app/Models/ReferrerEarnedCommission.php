<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReferrerEarnedCommission extends Model
{
    use HasFactory;

    protected $fillable = ['referrer_id', 'order_id', 'commission_structure_id', 'commission'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'referrer_id' => 'integer',
        'order_id' => 'integer',
        'commission_structure_id' => 'integer',
        'commission' => 'float',
    ];

    /**
     * @return BelongsTo<Referrer, ReferrerEarnedCommission>
     */
    public function referrer(): BelongsTo
    {
        return $this->belongsTo(Referrer::class);
    }

    /**
     * @return BelongsTo<Order, ReferrerEarnedCommission>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * @return BelongsTo<CommissionStructure, ReferrerEarnedCommission>
     */
    public function commissionStructure(): BelongsTo
    {
        return $this->belongsTo(CommissionStructure::class);
    }
}
