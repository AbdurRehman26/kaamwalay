<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CardSetResource\Pages;
use App\Models\CardSet;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class CardSetResource extends Resource
{
    protected static ?string $model = CardSet::class;

    protected static ?string $navigationIcon = 'heroicon-o-collection';

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $navigationGroup = 'Card Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('card_series_id')
                    ->required(),
                Forms\Components\TextInput::make('card_category_id')
                    ->required(),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(200),
                Forms\Components\TextInput::make('description')
                    ->required()
                    ->maxLength(1000),
                Forms\Components\TextInput::make('cards_number'),
                Forms\Components\TextInput::make('secret_cards'),
                Forms\Components\TextInput::make('release_date_formatted')
                    ->maxLength(50),
                Forms\Components\TextInput::make('image_path')
                    ->required()
                    ->maxLength(1000),
                Forms\Components\TextInput::make('image_bucket_path')
                    ->required()
                    ->maxLength(1000),
                Forms\Components\TextInput::make('set_url')
                    ->maxLength(1000),
                Forms\Components\DatePicker::make('release_date'),
                Forms\Components\TextInput::make('release_year'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->sortable(),
                Tables\Columns\TextColumn::make('card_series_id'),
                Tables\Columns\TextColumn::make('card_category_id'),
                Tables\Columns\TextColumn::make('name')->searchable(),
                Tables\Columns\TextColumn::make('description'),
                Tables\Columns\TextColumn::make('cards_number'),
                Tables\Columns\TextColumn::make('secret_cards'),
                Tables\Columns\TextColumn::make('release_date_formatted'),
                Tables\Columns\TextColumn::make('image_path'),
                Tables\Columns\TextColumn::make('image_bucket_path'),
                Tables\Columns\TextColumn::make('set_url'),
                Tables\Columns\TextColumn::make('release_date')
                    ->date(),
                Tables\Columns\TextColumn::make('release_year'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
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
            'index' => Pages\ListCardSets::route('/'),
            'create' => Pages\CreateCardSet::route('/create'),
            'edit' => Pages\EditCardSet::route('/{record}/edit'),
        ];
    }
}
