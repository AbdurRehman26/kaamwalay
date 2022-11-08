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
        'is_active',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'commission_type' => CommissionTypeEnum::class,
    ];

    public function hasCommissionTypePercentage(): bool
    {
        return $this->hasCommissionType(CommissionTypeEnum::PERCENTAGE);
    }

    private function hasCommissionType(CommissionTypeEnum $type): bool
    {
        return $this->commission_type === $type;
    }

    public function earnedCommission(): float
    {
        return $this->hasMany(SalesmanEarnedCommission::class, 'salesman_id', 'user_id')->sum('commission');
    }
}
