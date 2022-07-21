<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CustomerAddressResource\Pages;
use App\Models\CustomerAddress;

class CustomerAddressResource extends AddressResource
{
    protected static ?string $model = CustomerAddress::class;

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCustomerAddresses::route('/'),
        ];
    }
}
