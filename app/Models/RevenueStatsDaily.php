<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RevenueStatsDaily extends Model
{
    use HasFactory;

    protected $table = "revenue_stats_daily";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['event_at', 'profit', 'revenue'];
}
