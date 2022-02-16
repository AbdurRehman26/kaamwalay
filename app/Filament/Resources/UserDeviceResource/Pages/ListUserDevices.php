<?php

namespace App\Filament\Resources\UserDeviceResource\Pages;

use App\Filament\Resources\UserDeviceResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Tables\Filters\SelectFilter;

class ListUserDevices extends ListRecords
{
    protected static string $resource = UserDeviceResource::class;

    protected function getTableFilters(): array
    {
        return [
            SelectFilter::make('platform')
                ->options([
                    'ios' => 'iOS',
                    'android' => 'Android',
                ]),
        ];
    }
}
