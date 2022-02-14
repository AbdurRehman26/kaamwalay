<?php

namespace App\Filament\Widgets;

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Card;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getCards(): array
    {
        return [
            Card::make('Total Paid Orders', Order::placed()->count()),
            Card::make('Total Users', User::count()),
            Card::make('Total TCGs Cards', CardProduct::whereNotNull('card_category_id')->count()),
        ];
    }
}
