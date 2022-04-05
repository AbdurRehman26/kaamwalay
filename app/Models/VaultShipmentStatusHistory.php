<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VaultShipmentStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'vault_shipment_id',
        'vault_shipment_status_id',
        'user_id',
    ];

    public function vaultShipment(): BelongsTo
    {
        return $this->belongsTo(VaultShipment::class);
    }

    public function vaultShipmentStatus(): BelongsTo
    {
        return $this->belongsTo(VaultShipmentStatus::class);
    }
}
