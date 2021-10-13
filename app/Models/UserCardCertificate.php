<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCardCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_card_id',
        'number',
    ];

    protected $casts = [
        'id' => 'integer',
        'user_card_id' => 'integer',
    ];

    public function userCard(): BelongsTo
    {
        return $this->belongsTo(UserCard::class);
    }
}
