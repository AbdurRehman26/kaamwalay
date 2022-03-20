<?php

namespace App\Filament\Resources\CardProductResource\Pages;

use App\Filament\Resources\CardProductResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Collection;

class ListCardProducts extends ListRecords
{
    protected static string $resource = CardProductResource::class;

    protected function getTableFilters(): array
    {
        return [
            SelectFilter::make('card_category_id')
                ->relationship('cardCategory', 'name')
                ->label('Category'),
            SelectFilter::make('card_set_id')
                ->relationship('cardSet', 'name')
                ->label('Set'),
        ];
    }

    protected function getTableBulkActions(): array
    {
        return [
            BulkAction::make('reindex')
                ->action(function (Collection $records) {
                    $records->each->searchable();
                    $this->notify('success', 'Records have been re-indexed on Algolia.');
                })
                ->label('Reindex on Algolia')
                ->icon('heroicon-o-document-add')
                ->deselectRecordsAfterCompletion()
                ->requiresConfirmation(),
        ];
    }
}
