<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Components\BelongsToSelect;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Form;
use Filament\Resources\Resource;
use Filament\Resources\Table;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $recordTitleAttribute = 'order_number';

    protected static ?string $navigationGroup = 'Order Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('id')->disabled(),
                TextInput::make('user_id')
                    ->required(),
                TextInput::make('payment_plan_id')
                    ->required(),
                TextInput::make('order_status_id'),
                TextInput::make('shipping_order_address_id'),
                TextInput::make('billing_order_address_id'),
                TextInput::make('payment_method_id'),
                TextInput::make('shipping_method_id')
                    ->required(),
                TextInput::make('coupon_id'),
                TextInput::make('order_shipment_id'),
                TextInput::make('order_customer_shipment_id'),
                TextInput::make('reviewed_by_id'),
                TextInput::make('graded_by_id'),
                TextInput::make('order_number')
                    ->maxLength(255),
                TextInput::make('service_fee'),
                TextInput::make('shipping_fee'),
                TextInput::make('grand_total'),
                TextInput::make('amount_paid_from_wallet'),
                TextInput::make('grand_total_before_discount'),
                TextInput::make('discounted_amount'),
                TextInput::make('payment_method_discounted_amount'),
                TextInput::make('extra_charge_total')
                    ->required(),
                TextInput::make('refund_total')
                    ->required(),
                TextInput::make('invoice_id'),
                Forms\Components\Textarea::make('notes')
                    ->maxLength(65535),
                BelongsToSelect::make('salesman')
                    // @phpstan-ignore-next-line
                    ->relationship('salesman', 'email', fn (Builder $query) => $query->salesman())
                    ->nullable(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
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
            RelationManagers\OrderItemsRelationManager::class,
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
