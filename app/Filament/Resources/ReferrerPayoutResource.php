<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReferrerPayoutResource\Pages;
use App\Models\ReferrerPayout;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ReferrerPayoutResource extends Resource
{
    protected static ?string $model = ReferrerPayout::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?string $navigationGroup = 'Referral Program';

    protected static ?string $recordTitleAttribute = 'id';

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReferrerPayouts::route('/'),
        ];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('user_id')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('payout_account')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('payment_method')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('amount')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('initiated_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('completed_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('referrer_payout_status_id')->sortable(),
                Tables\Columns\TextColumn::make('paid_by')->sortable(),
                Tables\Columns\TextColumn::make('transaction_id')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('transaction_status')->sortable()->searchable(),
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
            ->defaultSort('created_at', 'desc')
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('id')
                    ->disabled(),
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'email')
                    ->required(),
                Forms\Components\TextInput::make('payout_account')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('payment_method')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('amount')
                    ->required(),
                Forms\Components\TextInput::make('initiated_at'),
                Forms\Components\TextInput::make('completed_at'),
                Forms\Components\Select::make('referrer_payout_status_id')
                    ->relationship('referrerPayoutStatus', 'name')
                    ->required(),
                Forms\Components\Select::make('paid_by')
                    ->relationship('paidBy', 'email'),
                Forms\Components\TextInput::make('transaction_id')->maxLength(255),
                Forms\Components\TextInput::make('transaction_status')->maxLength(255),
            ]);
    }
}
