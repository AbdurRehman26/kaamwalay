<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Resources\Form;
use Filament\Resources\RelationManagers\HasManyRelationManager;
use Filament\Resources\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms;

class OrderItemsRelationManager extends HasManyRelationManager
{
    protected static string $relationship = 'orderItems';

    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('declared_value_per_unit')
                    ->required(),
                Forms\Components\TextInput::make('declared_value_total')
                    ->required(),
                Forms\Components\TextInput::make('card_product_id')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id'),
                TextColumn::make('declared_value_per_unit'),
                TextColumn::make('declared_value_total'),
                TextColumn::make('card_product_id'),
            ])
            ->filters([
                //
            ]);
    }
}
