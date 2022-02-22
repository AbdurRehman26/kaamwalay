<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CustomerAddressResource\Pages;
use App\Models\CustomerAddress;
use App\Models\State;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class CustomerAddressResource extends Resource
{
    protected static ?string $model = CustomerAddress::class;

    protected static ?string $navigationIcon = 'heroicon-o-location-marker';

    protected static ?string $recordTitleAttribute = 'id';

    protected static ?string $navigationGroup = 'User Management';

    public static function form(Form $form): Form
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
                Forms\Components\Textarea::make('address')
                    ->required()
                    ->maxLength(255)
                    ->rows(3),
                Forms\Components\TextInput::make('city')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('state')->options(State::all()->pluck('code'))
                    ->required()
                    ->searchable()
                    ->disablePlaceholderSelection(),
                Forms\Components\TextInput::make('zip')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('phone')
                    ->tel()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('flat')
                    ->maxLength(255),
                Forms\Components\BelongsToSelect::make('country_id')
                    ->relationship('country', 'name')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('first_name'),
                Tables\Columns\TextColumn::make('last_name'),
                Tables\Columns\TextColumn::make('address'),
                Tables\Columns\TextColumn::make('city'),
                Tables\Columns\TextColumn::make('state'),
                Tables\Columns\TextColumn::make('zip'),
                Tables\Columns\TextColumn::make('phone'),
                Tables\Columns\TextColumn::make('flat'),
                Tables\Columns\TextColumn::make('country.name'),
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
            'index' => Pages\ListCustomerAddresses::route('/'),
            'create' => Pages\CreateCustomerAddress::route('/create'),
            'edit' => Pages\EditCustomerAddress::route('/{record}/edit'),
        ];
    }
}
