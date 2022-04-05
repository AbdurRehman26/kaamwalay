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
        'vault_shipment_item_id',
        'user_id',
        'shipping_address_id',
        'billing_address_id',
        'vault_shipment_status_id',
        'coupon_id',
        'shipping_method_id',
        'shipment_number',
        'tracking_number',
        'tracking_url',
        'shipping_provider',
        'shipping_fee',
        'payment_method_discount',
        'amount_paid_from_wallet',
        'discounted_amount',
        'grand_total',
        'shipped_at',
    ];

    protected $casts = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vaultShipmentItems(): HasMany
    {
        return $this->hasMany(VaultShipmentItem::class);
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

    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function vaultShipmentStatusHistories(): HasMany
    {
        return $this->hasMany(VaultShipmentStatusHistory::class);
    }

    public function vaultShipmentPayments(): HasMany
    {
        return $this->hasMany(VaultShipmentPayment::class);
    }
}
