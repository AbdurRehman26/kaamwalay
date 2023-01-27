<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'level',
        'fixed_value',
        'percentage_value',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'level' => 'integer',
        'fixed_value' => 'float',
        'percentage_value' => 'float',
    ];
}
