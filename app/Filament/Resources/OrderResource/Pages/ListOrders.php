<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Tables\Filters\SelectFilter;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    protected function getTableFilters(): array
    {
        return [
            SelectFilter::make('order_status_id')
                ->options([
                    1 => 'Payment Pending',
                    2 => 'Placed',
                    3 => 'Reviewed',
                    4 => 'Graded',
                    5 => 'Shipped',
                ])
                ->label('Status'),
        ];
    }
}
