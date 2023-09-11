<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CardSeriesResource\Pages;
use App\Models\CardSeries;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CardSeriesResource extends Resource
{
    protected static ?string $model = CardSeries::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $navigationGroup = 'Card Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('card_category_id')
                    ->relationship('cardCategory', 'name')
                    ->required(),
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(200),
                Forms\Components\TextInput::make('image_path')
                    ->required()
                    ->maxLength(1000),
                Forms\Components\TextInput::make('image_bucket_path')
                    ->required()
                    ->maxLength(1000),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('cardCategory.name'),
                Tables\Columns\TextColumn::make('name')->searchable(),
                Tables\Columns\TextColumn::make('image_path'),
                Tables\Columns\TextColumn::make('image_bucket_path'),
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
            'index' => Pages\ListCardSeries::route('/'),
            'create' => Pages\CreateCardSeries::route('/create'),
            'edit' => Pages\EditCardSeries::route('/{record}/edit'),
        ];
    }
}
