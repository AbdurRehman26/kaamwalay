<?php

namespace App\Models;

use App\Enums\Salesman\CommissionTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    /**
     * @return HasMany<SalesmanEarnedCommission>
     */
    public function salesmanEarnedCommissions(): HasMany
    {
        return $this->hasMany(SalesmanEarnedCommission::class, 'salesman_id', 'user_id');
    }

    public function earnedCommission(): float
    {
        return $this->salesmanEarnedCommissions()->sum('commission');
    }

    public function earnedCommissionTillLastMonth(): float
    {
        return $this->salesmanEarnedCommissions()
            ->where('created_at', '<=', now()->startOfMonth())
            ->sum('commission');
    }
}
