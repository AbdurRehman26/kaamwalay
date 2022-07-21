<?php

namespace App\Filament\Resources\CardRarityResource\Pages;

use App\Filament\Resources\CardRarityResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageCardRarities extends ManageRecords
{
    protected static string $resource = CardRarityResource::class;

    protected function getActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
