<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CardProductResource\Pages;
use App\Models\CardProduct;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;

class CardProductResource extends Resource
{
    protected static ?string $model = CardProduct::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('id')->disabled(),
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('card_reference_id')
                    ->maxLength(255),
                Forms\Components\BelongsToSelect::make('card_category')->relationship('cardCategory', 'name'),
                Forms\Components\BelongsToSelect::make('card_set')->relationship('cardSet', 'name'),
                TextInput::make('added_by'),
                TextInput::make('rarity')
                    ->maxLength(255),
                TextInput::make('card_number')
                    ->maxLength(255),
                TextInput::make('image_path')
                    ->maxLength(1000),
                TextInput::make('card_url')
                    ->maxLength(1000),
                TextInput::make('image_bucket_path')
                    ->maxLength(1000),
                TextInput::make('card_number_order')
                    ->maxLength(255),
                TextInput::make('edition')
                    ->required()
                    ->maxLength(255),
                TextInput::make('surface')
                    ->required()
                    ->maxLength(255),
                TextInput::make('variant')
                    ->required()
                    ->maxLength(255),
                TextInput::make('language')
                    ->required()
                    ->maxLength(255),
                TextInput::make('variant_category')
                    ->required()
                    ->maxLength(255),
                TextInput::make('variant_name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('holo_type')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->maxLength(65535),
                Forms\Components\Toggle::make('added_manually')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->searchable(),
                TextColumn::make('card_reference_id')->searchable(),
                TextColumn::make('cardCategory.name')->label('Category')->sortable(),
                TextColumn::make('cardSet.cardSeries.name')->label('Series'),
                TextColumn::make('cardSet.name')->label('Set')->sortable(),
                TextColumn::make('rarity'),
                TextColumn::make('card_number'),
                TextColumn::make('image_path'),
                TextColumn::make('card_url'),
                TextColumn::make('image_bucket_path'),
                TextColumn::make('card_number_order'),
                TextColumn::make('edition'),
                TextColumn::make('surface'),
                TextColumn::make('variant'),
                TextColumn::make('language'),
                TextColumn::make('variant_category'),
                TextColumn::make('variant_name'),
                TextColumn::make('holo_type'),
                TextColumn::make('created_at')
                    ->dateTime(),
                TextColumn::make('updated_at')
                    ->dateTime(),
                TextColumn::make('description'),
                Tables\Columns\BooleanColumn::make('added_manually'),
                TextColumn::make('added_by'),
            ])
            ->filters([
                //
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCardProducts::route('/'),
            'create' => Pages\CreateCardProduct::route('/create'),
            'edit' => Pages\EditCardProduct::route('/{record}/edit'),
        ];
    }
}
