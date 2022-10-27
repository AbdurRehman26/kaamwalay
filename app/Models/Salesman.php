<?php

namespace App\Models;

use App\Enums\Salesman\CommissionTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salesman extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'commission_type',
        'commission_value',
        'is_active'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'commission_type' => CommissionTypeEnum::class,
    ];
}
