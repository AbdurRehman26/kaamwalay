<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Components\BelongsToSelect;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $recordTitleAttribute = 'customer_number';

    protected static ?string $navigationGroup = 'User Management';

    public static function getGloballySearchableAttributes(): array
    {
        return ['email', 'customer_number'];
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        /** @var User $record */
        return [
            'Email' => $record->email,
            'Customer Number' => $record->customer_number,
        ];
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('id')->disabled(),
                TextInput::make('first_name')
                    ->maxLength(255),
                TextInput::make('last_name')
                    ->maxLength(255),
                TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                TextInput::make('customer_number')
                    ->maxLength(255),
                TextInput::make('username')
                    ->required()
                    ->maxLength(255),
                TextInput::make('phone')
                    ->tel()
                    ->maxLength(255),
                TextInput::make('profile_image')
                    ->maxLength(255),
                TextInput::make('stripe_id')
                    ->maxLength(255),
                TextInput::make('pm_type')
                    ->maxLength(255),
                TextInput::make('pm_last_four')
                    ->maxLength(4),
                BelongsToSelect::make('salesman')
                    // @phpstan-ignore-next-line
                    ->relationship('salesman', 'email', fn (Builder $query) => $query->salesman())
                    ->nullable()
                    ->searchable(),
                Forms\Components\BelongsToManyMultiSelect::make('role')
                    ->relationship('roles', 'name'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
                TextColumn::make('customer_number')->searchable(),
                TextColumn::make('first_name'),
                TextColumn::make('last_name'),
                TextColumn::make('email')->searchable(),
                TextColumn::make('username'),
                TextColumn::make('phone'),
                TextColumn::make('email_verified_at')
                    ->dateTime(),
                TextColumn::make('stripe_id'),
                TextColumn::make('pm_type'),
                TextColumn::make('pm_last_four'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('deleted_at')
                    ->dateTime(),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
