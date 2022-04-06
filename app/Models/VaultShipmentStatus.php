<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VaultShipmentStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
    ];

    /**
     * @return HasMany<VaultShipment>
     */
    public function vaultShipments(): HasMany
    {
        return $this->hasMany(VaultShipment::class);
    }

    /**
     * @return HasMany<VaultShipmentStatusHistory>
     */
    public function vaultShipmentStatusHistories(): HasMany
    {
        return $this->hasMany(VaultShipmentStatusHistory::class);
    }
}
