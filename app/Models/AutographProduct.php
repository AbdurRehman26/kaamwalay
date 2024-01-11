<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class AutographProduct extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'autograph_category_id',
        'autograph_type_id',
        'certificate_number',
        'name',
        'image_url',
        'signed_by',
        'signed_at',
    ];

    protected $casts = [
        'signed_at' => 'timestamp',
    ];

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'autograph_category' => $this->autographCategory->name,
            'autograph_type' => $this->autographType->name,
            'certificate_number' => $this->certificate_number,
            'name' => $this->getLongName(),
            'image_url' => $this->image_url,
            'created_at_timestamp' => $this->created_at->unix(),
        ];
    }

    public function autographCategory(): BelongsTo
    {
        return $this->belongsTo(AutographCategory::class);
    }

    public function autographType(): BelongsTo
    {
        return $this->belongsTo(AutographType::class);
    }

    public function getLongName(): string
    {
        return $this->signed_by.' Signed '.$this->name;
    }
}
