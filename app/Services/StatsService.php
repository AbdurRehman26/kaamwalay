<?php

namespace App\Services;

use Carbon\Carbon;

class StatsService
{
    public function getStartDate(string $timeFilter, string $customDate = ''): string
    {
        $now = Carbon::now();

        switch ($timeFilter) {
            case 'this_month':
                $startDate = $now->copy()->startOfMonth()->toDateString();

                break;
            case 'last_month':
                $startDate = $now->copy()->subMonth()->startOfMonth()->toDateString();

                break;
            case 'this_year':
                $startDate = $now->copy()->startOfYear()->toDateString();

                break;
            case 'last_year':
                $startDate = $now->copy()->subYear()->startOfYear()->toDateString();

                break;
            case 'custom':
                $startDate = $customDate;

                break;
            default:
                return '';
        }

        return $startDate.' 00:00:00';
    }

    public function getEndDate(string $timeFilter, string $customDate = ''): string
    {
        $now = Carbon::now();

        switch ($timeFilter) {
            case 'this_month':
                $endDate = $now->copy()->endOfMonth()->toDateString();

                break;
            case 'last_month':
                $endDate = $now->copy()->subMonth()->endOfMonth()->toDateString();

                break;
            case 'this_year':
                $endDate = $now->copy()->endOfYear()->toDateString();

                break;
            case 'last_year':
                $endDate = $now->copy()->subYear()->endOfYear()->toDateString();

                break;
            case 'custom':
                $endDate = $customDate;

                break;
            default:
                return '';
        }

        return $endDate.' 23:59:59';
    }
}
