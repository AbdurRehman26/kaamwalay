<?php

namespace App\Filament\Resources\CardSurfaceResource\Pages;

use App\Filament\Resources\CardSurfaceResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageCardSurfaces extends ManageRecords
{
    protected static string $resource = CardSurfaceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
