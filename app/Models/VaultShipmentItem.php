<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VaultShipmentItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_card_id',
        'vault_shipment_id',
    ];

    public function userCard(): BelongsTo
    {
        return $this->belongsTo(UserCard::class);
    }

    public function vaultShipment(): BelongsTo
    {
        return $this->belongsTo(VaultShipment::class);
    }
}
