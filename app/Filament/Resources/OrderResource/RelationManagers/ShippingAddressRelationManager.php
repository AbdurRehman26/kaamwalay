<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

class ShippingAddressRelationManager extends AddressRelationManager
{
    protected static string $relationship = 'shippingAddress';

    protected static ?string $recordTitleAttribute = 'id';
}
