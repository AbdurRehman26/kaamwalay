<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AutographProduct extends Model
{
    use HasFactory;

    protected $casts = [
        'signed_at' => 'timestamp',
    ];

    public function autographCategory(): BelongsTo
    {
        return $this->belongsTo(AutographCategory::class);
    }

    public function autographType(): BelongsTo
    {
        return $this->belongsTo(AutographType::class);
    }
}
