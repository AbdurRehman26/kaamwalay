<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RevenueStatsMonthly extends Model
{
    use HasFactory;
    
    protected $table = "revenue_stats_monthly";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['event_at', 'monthly_profit', 'monthly_revenue'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'monthly_profit' => 'float',
        'monthly_revenue' => 'float',
    ];
}
