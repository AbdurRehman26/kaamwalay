<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VaultShipmentPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'request',
        'response',
        'payment_method_id',
        'payment_provider_reference_id',
        'amount',
        'provider_fee',
        'vault_shipment_id',
    ];

    /**
     * @return BelongsTo<VaultShipment, VaultShipmentPayment>
     */
    public function vaultShipment(): BelongsTo
    {
        return $this->belongsTo(VaultShipment::class);
    }

    /**
     * @return BelongsTo<PaymentMethod, VaultShipmentPayment>
     */
    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
