<?php

namespace App\Filament\Resources\OrderAddressResource\Pages;

use App\Filament\Resources\OrderAddressResource;
use Filament\Resources\Pages\ListRecords;

class ListOrderAddresses extends ListRecords
{
    protected static string $resource = OrderAddressResource::class;
}
