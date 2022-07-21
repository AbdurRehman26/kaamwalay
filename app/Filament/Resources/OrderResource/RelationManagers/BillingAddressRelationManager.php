<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

class BillingAddressRelationManager extends AddressRelationManager
{
    protected static string $relationship = 'billingAddress';

    protected static ?string $recordTitleAttribute = 'id';
}
