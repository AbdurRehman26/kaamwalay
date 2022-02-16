<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserCardResource\Pages;
use App\Models\UserCard;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables;

class UserCardResource extends Resource
{
    protected static ?string $model = UserCard::class;

    protected static ?string $navigationIcon = 'heroicon-o-collection';

    protected static ?string $recordTitleAttribute = 'certificate_number';

    protected static ?string $navigationGroup = 'Order Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('certificate_number')
                    ->maxLength(255),
                Forms\Components\TextInput::make('order_item_id')
                    ->required(),
                Forms\Components\TextInput::make('user_id')
                    ->required(),
//                Forms\Components\TextInput::make('human_grade_values'),
//                Forms\Components\TextInput::make('robo_grade_values'),
//                Forms\Components\TextInput::make('overall_values'),
                Forms\Components\TextInput::make('overall_grade'),
                Forms\Components\TextInput::make('overall_grade_nickname')
                    ->maxLength(255),
                Forms\Components\TextInput::make('grading_id')
                    ->maxLength(255),
                Forms\Components\TextInput::make('ai_model_numbers'),
                Forms\Components\TextInput::make('generated_images'),
                Forms\Components\TextInput::make('grade_delta'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->sortable(),
                Tables\Columns\TextColumn::make('certificate_number'),
                Tables\Columns\TextColumn::make('order_item_id'),
                Tables\Columns\TextColumn::make('user_id'),
                Tables\Columns\TextColumn::make('overall_grade'),
                Tables\Columns\TextColumn::make('overall_grade_nickname'),
                Tables\Columns\TextColumn::make('grading_id'),
                Tables\Columns\TextColumn::make('ai_model_numbers'),
                Tables\Columns\TextColumn::make('grade_delta'),
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
            'index' => Pages\ListUserCards::route('/'),
            'create' => Pages\CreateUserCard::route('/create'),
            'edit' => Pages\EditUserCard::route('/{record}/edit'),
        ];
    }
}
