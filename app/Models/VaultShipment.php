<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
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

    /**
     * @return BelongsTo<User, VaultShipment>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<VaultShipmentItem>
     */
    public function vaultShipmentItems(): HasMany
    {
        return $this->hasMany(VaultShipmentItem::class);
    }

    /**
     * @return BelongsTo<OrderAddress, VaultShipment>
     */
    public function shippingAddress(): BelongsTo
    {
        return $this->belongsTo(OrderAddress::class);
    }

    /**
     * @return BelongsTo<OrderAddress, VaultShipment>
     */
    public function billingAddress(): BelongsTo
    {
        return $this->belongsTo(OrderAddress::class);
    }

    /**
     * @return BelongsTo<VaultShipmentStatus, VaultShipment>
     */
    public function vaultShipmentStatus(): BelongsTo
    {
        return $this->belongsTo(VaultShipmentStatus::class);
    }

    /**
     * @return BelongsTo<ShippingMethod, VaultShipment>
     */
    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    /**
     * @return BelongsTo<Coupon, VaultShipment>
     */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * @return HasMany<VaultShipmentStatusHistory>
     */
    public function vaultShipmentStatusHistories(): HasMany
    {
        return $this->hasMany(VaultShipmentStatusHistory::class);
    }

    /**
     * @return HasMany<VaultShipmentPayment>
     */
    public function vaultShipmentPayments(): HasMany
    {
        return $this->hasMany(VaultShipmentPayment::class);
    }

    /**
     * @param  Builder<VaultShipment>  $query
     * @param  User  $user
     * @return Builder<VaultShipment>
     */
    public function scopeForUser(Builder $query, User $user): Builder
    {
        return $query->where('vault_shipments.user_id', $user->id);
    }
}
