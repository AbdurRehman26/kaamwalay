<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\LineChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class PaidOrdersChart extends LineChartWidget
{
    protected static ?int $sort = 2;

    public ?string $filter = 'last_12_months';

    protected function getHeading(): string
    {
        return 'Total Paid Orders';
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

        $data = Trend::query(
            Order::query()
                ->placed()
            )
            ->between(
                start: $start,
                end: now()->endOfDay(),
            )
            ->perMonth()
            ->count();

        return [
            'datasets' => [
                [
                    'label' => 'Paid orders',
                    'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
                ],
            ],
            'labels' => $data->map(fn (TrendValue $value) => $value->date),
        ];
    }
}
