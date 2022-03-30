<?php

namespace App\Models;

use App\Enums\Vault\VaultShipmentItemStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VaultShipmentItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_card_id',
        'vault_shipment_id',
        'order_id',
        'status',
        'cards_count',
    ];

    protected $casts = [
        'status' => VaultShipmentItemStatusEnum::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function userCard(): BelongsTo
    {
        return $this->belongsTo(UserCard::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function vaultShipment(): BelongsTo
    {
        return $this->belongsTo(VaultShipment::class);
    }
}
