<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use App\Models\State;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class AddressRelationManager extends RelationManager
{
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('id')
                    ->disabled(),
                Forms\Components\TextInput::make('first_name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('last_name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('phone')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('address')
                    ->required()
                    ->maxLength(255)
                    ->rows(3),
                Forms\Components\Textarea::make('address_2')
                    ->maxLength(255)
                    ->rows(3),
                Forms\Components\TextInput::make('city')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('state')->options(State::pluck('code'))
                    ->required()
                    ->searchable()
                    ->disablePlaceholderSelection(),
                Forms\Components\TextInput::make('zip')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('flat')
                    ->maxLength(255),
                Forms\Components\Select::make('country')
                    ->relationship('country', 'name')
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id'),
                Tables\Columns\TextColumn::make('first_name'),
                Tables\Columns\TextColumn::make('last_name'),
                Tables\Columns\TextColumn::make('address'),
                Tables\Columns\TextColumn::make('city'),
                Tables\Columns\TextColumn::make('state'),
                Tables\Columns\TextColumn::make('zip'),
                Tables\Columns\TextColumn::make('phone'),
                Tables\Columns\TextColumn::make('flat'),
                Tables\Columns\TextColumn::make('country.name'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
