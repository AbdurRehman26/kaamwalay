<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VaultShipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'vault_item_id',
        'user_id',
        'shipping_address_id',
        'billing_address_id',
        'vault_shipment_status_id',
        'shipment_number',
        'shipping_provider',
        'tracking_url',
        'tracking_number',
    ];

    protected $casts = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vaultItem(): BelongsTo
    {
        return $this->belongsTo(VaultShipmentItem::class);
    }

    public function shippingAddress(): BelongsTo
    {
        return $this->belongsTo(OrderAddress::class);
    }

    public function billingAddress(): BelongsTo
    {
        return $this->belongsTo(OrderAddress::class);
    }

    public function vaultShipmentStatus(): BelongsTo
    {
        return $this->belongsTo(VaultShipmentStatus::class);
    }

    public function vaultItems(): HasMany
    {
        return $this->hasMany(VaultShipmentItem::class);
    }
}
