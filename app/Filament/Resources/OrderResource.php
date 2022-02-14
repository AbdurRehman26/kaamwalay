<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables\Columns\TextColumn;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $recordTitleAttribute = 'order_number';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('user_id')
                    ->required(),
                Forms\Components\HasManyRepeater::make('order_items')
                    ->relationship('orderItems')
                    ->schema([
                        Forms\Components\TextInput::make('id')
                            ->required(),
                        Forms\Components\TextInput::make('declared_value_per_unit')
                            ->required(),
                        Forms\Components\TextInput::make('declared_value_total')
                            ->required(),
                        Forms\Components\TextInput::make('card_product_id')
                            ->required(),
                    ]),
                Forms\Components\TextInput::make('payment_plan_id')
                    ->required(),
                Forms\Components\TextInput::make('order_status_id'),
                Forms\Components\TextInput::make('shipping_order_address_id')
                    ->required(),
                Forms\Components\TextInput::make('billing_order_address_id')
                    ->required(),
                Forms\Components\TextInput::make('payment_method_id')
                    ->required(),
                Forms\Components\TextInput::make('shipping_method_id')
                    ->required(),
                Forms\Components\TextInput::make('coupon_id'),
                Forms\Components\TextInput::make('order_shipment_id'),
                Forms\Components\TextInput::make('order_customer_shipment_id'),
                Forms\Components\TextInput::make('reviewed_by_id'),
                Forms\Components\TextInput::make('graded_by_id'),
                Forms\Components\TextInput::make('order_number')
                    ->maxLength(255),
                Forms\Components\TextInput::make('service_fee'),
                Forms\Components\TextInput::make('shipping_fee'),
                Forms\Components\TextInput::make('grand_total'),
                Forms\Components\TextInput::make('amount_paid_from_wallet'),
                Forms\Components\TextInput::make('grand_total_before_discount'),
                Forms\Components\TextInput::make('discounted_amount'),
                Forms\Components\TextInput::make('payment_method_discounted_amount'),
                Forms\Components\TextInput::make('extra_charge_total')
                    ->required(),
                Forms\Components\TextInput::make('refund_total')
                    ->required(),
                Forms\Components\TextInput::make('invoice_id'),
                Forms\Components\Textarea::make('notes')
                    ->maxLength(65535),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')->label('Submission #')->searchable(),
                TextColumn::make('created_at')->date('M j, Y')->label('Placed')->sortable(),
                TextColumn::make('user.customer_number')->label('Customer'),
                TextColumn::make('order_items_count')->counts('orderItems'),
                TextColumn::make('orderStatus.name')->label('Status'),
                TextColumn::make('grand_total')->money('usd', true)->label('Amount Paid'),
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
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
