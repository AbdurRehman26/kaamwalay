<?php

namespace App\Filament\Resources\CustomerAddressResource\Pages;

use App\Filament\Resources\CustomerAddressResource;
use Filament\Resources\Pages\ListRecords;

class ListCustomerAddresses extends ListRecords
{
    protected static string $resource = CustomerAddressResource::class;
}
