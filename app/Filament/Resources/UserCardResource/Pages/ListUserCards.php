<?php

namespace App\Filament\Resources\UserCardResource\Pages;

use App\Filament\Resources\UserCardResource;
use Filament\Resources\Pages\ListRecords;

class ListUserCards extends ListRecords
{
    protected static string $resource = UserCardResource::class;
}
