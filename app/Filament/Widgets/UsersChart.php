<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\User;
use Filament\Widgets\LineChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class UsersChart extends LineChartWidget
{
    protected static ?int $sort = 3;

    public ?string $filter = 'last_12_months';

    protected function getHeading(): string
    {
        return 'Total Users';
    }

    protected function getFilters(): ?array
    {
        return [
            'last_12_months' => 'Last 12 months',
            'year_to_date' => 'Year to date',
        ];
    }

    protected function getData(): array
    {
        $start = match ($this->filter) {
            'year_to_date' => now()->startOfYear(),
            default => now()->subMonths(12),
        };

        $data = Trend::model(User::class)
            ->between(
                start: $start,
                end: now()->endOfDay(),
            )
            ->perMonth()
            ->count();

        return [
            'datasets' => [
                [
                    'label' => 'Total customers',
                    'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
                ],
            ],
            'labels' => $data->map(fn (TrendValue $value) => $value->date),
        ];
    }
}
