<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Table;
use Filament\Tables;

class OrderPaymentsRelationManager extends RelationManager
{
    protected static string $relationship = 'orderPayments';

    protected static ?string $recordTitleAttribute = 'id';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('id')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('payment_method_id'),
                Forms\Components\TextInput::make('payment_provider_reference_id')
                    ->maxLength(255),
                Forms\Components\TextInput::make('amount'),
                Forms\Components\TextInput::make('type'),
                Forms\Components\TextInput::make('provider_fee'),
                Forms\Components\Textarea::make('notes')
                    ->maxLength(65535),
                Forms\Components\Textarea::make('request')
                    ->maxLength(65535)
                    ->rows(5),
                Forms\Components\Textarea::make('response')
                    ->maxLength(65535)
                    ->rows(5),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id'),
                Tables\Columns\TextColumn::make('paymentMethod.name'),
                Tables\Columns\TextColumn::make('payment_provider_reference_id'),
                Tables\Columns\TextColumn::make('notes'),
                Tables\Columns\TextColumn::make('amount'),
                Tables\Columns\TextColumn::make('type'),
                Tables\Columns\TextColumn::make('provider_fee'),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }
}
