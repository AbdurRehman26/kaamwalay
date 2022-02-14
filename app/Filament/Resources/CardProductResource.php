<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CardProductResource\Pages;
use App\Models\CardProduct;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class CardProductResource extends Resource
{
    protected static ?string $model = CardProduct::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('card_reference_id')
                    ->maxLength(255),
                Forms\Components\BelongsToSelect::make('card_category')->relationship('cardCategory', 'name'),
                Forms\Components\BelongsToSelect::make('card_set')->relationship('cardSet', 'name'),
                Forms\Components\TextInput::make('added_by'),
                Forms\Components\TextInput::make('rarity')
                    ->maxLength(255),
                Forms\Components\TextInput::make('card_number')
                    ->maxLength(255),
                Forms\Components\TextInput::make('image_path')
                    ->maxLength(1000),
                Forms\Components\TextInput::make('card_url')
                    ->maxLength(1000),
                Forms\Components\TextInput::make('image_bucket_path')
                    ->maxLength(1000),
                Forms\Components\TextInput::make('card_number_order')
                    ->maxLength(255),
                Forms\Components\TextInput::make('edition')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('surface')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('variant')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('language')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('variant_category')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('variant_name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('holo_type')
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
                Tables\Columns\TextColumn::make('name')->searchable(),
                Tables\Columns\TextColumn::make('card_reference_id')->searchable(),
                Tables\Columns\TextColumn::make('cardCategory.name')->label('Category')->sortable(),
                Tables\Columns\TextColumn::make('cardSet.cardSeries.name')->label('Series'),
                Tables\Columns\TextColumn::make('cardSet.name')->label('Set')->sortable(),
                Tables\Columns\TextColumn::make('rarity'),
                Tables\Columns\TextColumn::make('card_number'),
                Tables\Columns\TextColumn::make('image_path'),
                Tables\Columns\TextColumn::make('card_url'),
                Tables\Columns\TextColumn::make('image_bucket_path'),
                Tables\Columns\TextColumn::make('card_number_order'),
                Tables\Columns\TextColumn::make('edition'),
                Tables\Columns\TextColumn::make('surface'),
                Tables\Columns\TextColumn::make('variant'),
                Tables\Columns\TextColumn::make('language'),
                Tables\Columns\TextColumn::make('variant_category'),
                Tables\Columns\TextColumn::make('variant_name'),
                Tables\Columns\TextColumn::make('holo_type'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime(),
                Tables\Columns\TextColumn::make('description'),
                Tables\Columns\BooleanColumn::make('added_manually'),
                Tables\Columns\TextColumn::make('added_by'),
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
