<?php

namespace App\Filament\Resources\ShippingMatrixResource\Pages;

use App\Filament\Resources\ShippingMatrixResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageShippingMatrices extends ManageRecords
{
    protected static string $resource = ShippingMatrixResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
