<?php

namespace App\Filament\Resources\ShippingMatrixResource\Pages;

use App\Filament\Resources\ShippingMatrixResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageShippingMatrices extends ManageRecords
{
    protected static string $resource = ShippingMatrixResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
