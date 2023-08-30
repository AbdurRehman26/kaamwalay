<?php

namespace App\Filament\Widgets;

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?string $pollingInterval = null;

    protected static ?int $sort = 1;

    protected function getCards(): array
    {
        return [
            Stat::make('Total Paid Orders', Order::paid()->count()),
            Stat::make('Total Users', User::count()),
            Stat::make('Total TCGs Cards', CardProduct::whereNotNull('card_category_id')->count()),
        ];
    }
}
