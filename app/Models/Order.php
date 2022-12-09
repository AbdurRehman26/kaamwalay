<?php

namespace App\Models;

use App\Concerns\ActivityLog;
use App\Concerns\Order\HasOrderPayments;
use App\Contracts\Exportable;
use App\Enums\Order\OrderPaymentStatusEnum;
use App\Enums\Order\OrderStepEnum;
use App\Events\API\Order\V2\GenerateOrderInvoice;
use App\Http\Filters\AdminOrderSearchFilter;
use App\Http\Sorts\AdminSubmissionsCardsSort;
use App\Http\Sorts\AdminSubmissionsCustomerNumberSort;
use App\Http\Sorts\AdminSubmissionsPaymentStatusSort;
use App\Http\Sorts\AdminSubmissionsStatusSort;
use App\Http\Sorts\AdminSubmissionsTotalDeclaredValueSort;
use Carbon\Carbon;
use DateTime;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedInclude;
use Spatie\QueryBuilder\AllowedSort;

class Order extends Model implements Exportable
{
    use HasFactory, ActivityLog, HasOrderPayments;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'order_number',
        'shipping_fee',
        'service_fee',
        'grand_total',
        'user_id',
        'order_status_id',
        'payment_plan_id',
        'order_payment_plan_id',
        'shipping_order_address_id',
        'billing_order_address_id',
        'payment_method_id',
        'shipping_method_id',
        'coupon_id',
        'invoice_id',
        'order_label_id',
        'order_shipment_id',
        'order_customer_shipment_id',
        'arrived_at',
        'notes',
        'reviewed_by_id',
        'graded_by_id',
        'reviewed_at',
        'graded_at',
        'shipped_at',
        'auto_saved_at',
        'extra_charge_total',
        'refund_total',
        'payment_method_discounted_amount',
        'order_step',
        'payment_status',
        'salesman_id',
        'requires_cleaning',
        'cleaning_fee',
        'estimated_delivery_start_at',
        'estimated_delivery_end_at',
        'created_by',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'shipping_fee' => 'float',
        'service_fee' => 'float',
        'grand_total' => 'float',
        'user_id' => 'integer',
        'payment_plan_id' => 'integer',
        'order_payment_plan_id' => 'integer',
        'order_address_id' => 'integer',
        'shipping_order_address_id' => 'integer',
        'billing_order_address_id' => 'integer',
        'payment_method_id' => 'integer',
        'shipping_method_id' => 'integer',
        'invoice_id' => 'integer',
        'order_label_id' => 'integer',
        'order_status_id' => 'integer',
        'arrived_at' => 'date',
        'reviewed_by_id' => 'integer',
        'graded_by_id' => 'integer',
        'grand_total_cents' => 'integer',
        'reviewed_at' => 'datetime',
        'graded_at' => 'datetime',
        'shipped_at' => 'datetime',
        'extra_charge_total' => 'float',
        'refund_total' => 'float',
        'payment_method_discounted_amount' => 'float',
        'amount_paid_from_wallet' => 'float',
        'paid_at' => 'datetime',
        'order_step' => OrderStepEnum::class,
        'payment_status' => OrderPaymentStatusEnum::class,
        'requires_cleaning' => 'bool',
        'cleaning_fee' => 'float',
        'estimated_delivery_start_at' => 'datetime',
        'estimated_delivery_end_at' => 'datetime',
        'created_by' => 'integer',
    ];

    protected $appends = [
        'grand_total_cents',
        'grand_total_to_be_paid',
    ];

    protected $attributes = [
        'requires_cleaning' => false,
        'cleaning_fee' => 0,
    ];

    public static function getAllowedAdminIncludes(): array
    {
        return [
            AllowedInclude::relationship('invoice'),
            AllowedInclude::relationship('orderLabel'),
            AllowedInclude::relationship('paymentPlan'),
            AllowedInclude::relationship('orderItems'),
            AllowedInclude::relationship('orderStatus'),
            AllowedInclude::relationship('orderPayment', 'firstOrderPayment'),
            AllowedInclude::relationship('billingAddress'),
            AllowedInclude::relationship('shippingAddress'),
            AllowedInclude::relationship('orderStatusHistory'),
            AllowedInclude::relationship('orderStatusHistory.orderStatus'),
            AllowedInclude::relationship('customer', 'user'),
            AllowedInclude::relationship('customer.wallet', 'user.wallet'),
            AllowedInclude::relationship('orderShipment'),
            AllowedInclude::relationship('orderCustomerShipment'),
            AllowedInclude::relationship('extraCharges'),
            AllowedInclude::relationship('refunds'),
            AllowedInclude::relationship('coupon'),
            AllowedInclude::relationship('shippingMethod'),
            AllowedInclude::relationship('orderCertificate'),
        ];
    }

    public static function getAllowedAdminFilters(): array
    {
        return [
            AllowedFilter::exact('order_id', 'id'),
            AllowedFilter::partial('order_number'),
            AllowedFilter::scope('status'),
            AllowedFilter::scope('order_status', 'status'),
            AllowedFilter::scope('customer_name'),
            AllowedFilter::scope('promo_code'),
            AllowedFilter::scope('customer_id'),
            AllowedFilter::scope('salesman_id'),
            AllowedFilter::exact('payment_status'),
            AllowedFilter::custom('search', new AdminOrderSearchFilter),
        ];
    }

    public static function getAllowedAdminSorts(): array
    {
        return [
            AllowedSort::custom('customer_number', new AdminSubmissionsCustomerNumberSort),
            AllowedSort::custom('total_declared_value', new AdminSubmissionsTotalDeclaredValueSort),
            AllowedSort::custom('cards', new AdminSubmissionsCardsSort),
            AllowedSort::custom('status', new AdminSubmissionsStatusSort),
            AllowedSort::custom('payment_status', new AdminSubmissionsPaymentStatusSort),
            'created_at',
            'order_number',
            'arrived_at',
            'grand_total',
        ];
    }

    public static function getAllowedIncludes(): array
    {
        return [
            AllowedInclude::relationship('invoice'),
            AllowedInclude::relationship('paymentPlan'),
            AllowedInclude::relationship('originalPaymentPlan'),
            AllowedInclude::relationship('orderItems'),
            AllowedInclude::relationship('orderStatus'),
            AllowedInclude::relationship('orderPayment', 'firstOrderPayment'),
            AllowedInclude::relationship('billingAddress'),
            AllowedInclude::relationship('shippingAddress'),
            AllowedInclude::relationship('orderStatusHistory'),
            AllowedInclude::relationship('orderStatusHistory.orderStatus'),
            AllowedInclude::relationship('customer', 'user'),
            AllowedInclude::relationship('orderShipment'),
            AllowedInclude::relationship('orderCustomerShipment'),
            AllowedInclude::relationship('extraCharges'),
            AllowedInclude::relationship('refunds'),
            AllowedInclude::relationship('coupon'),
            AllowedInclude::relationship('shippingMethod'),
        ];
    }

    public static function getAllowedFilters(): array
    {
        return [
            AllowedFilter::partial('order_number'),
            AllowedFilter::exact('order_status_id'),
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paymentPlan(): BelongsTo
    {
        return $this->belongsTo(OrderPaymentPlan::class, 'order_payment_plan_id');
    }

    /**
     * @return BelongsTo<PaymentPlan, Order>
     */
    public function originalPaymentPlan(): BelongsTo
    {
        return $this->belongsTo(PaymentPlan::class, 'payment_plan_id');
    }

    public function orderStatus(): BelongsTo
    {
        return $this->belongsTo(OrderStatus::class);
    }

    public function orderStatusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function shippingAddress(): BelongsTo
    {
        return $this->belongsTo(OrderAddress::class, 'shipping_order_address_id');
    }

    public function billingAddress(): BelongsTo
    {
        return $this->belongsTo(OrderAddress::class, 'billing_order_address_id');
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function orderLabel(): HasOne
    {
        return $this->hasOne(OrderLabel::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by_id');
    }

    public function gradedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'graded_by_id');
    }

    /**
     * @return BelongsTo<User, Order>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeForUser(Builder $query, User $user): Builder
    {
        return $query->where('orders.user_id', $user->id);
    }

    /**
     * @param  Builder <Order> $query
     * @return Builder <Order>
     */
    public function scopeForSalesman(Builder $query, User $user): Builder
    {
        return $query->where('orders.salesman_id', $user->id);
    }

    public function isPayable(string $version = 'v1'): bool
    {
        if ($version === 'v1') {
            return $this->order_status_id === OrderStatus::PAYMENT_PENDING;
        }

        return $this->order_status_id > OrderStatus::PAYMENT_PENDING
            && ! $this->isCancelled()
            && ! $this->payment_status->isPaid();
    }

    /**
     * @param  Builder <Order> $query
     * @return Builder <Order>
    */
    public function scopePaid(Builder $query): Builder
    {
        return $query->where('payment_status', OrderPaymentStatusEnum::PAID);
    }

    public function scopePlaced(Builder $query): Builder
    {
        return $query->whereHas('orderStatusHistory', function ($query) {
            return $query->where('order_status_id', OrderStatus::PLACED);
        });
    }

    public function getGrandTotalCentsAttribute(): int
    {
        return (int) bcmul((string) $this->grand_total_to_be_paid, (string) 100);
    }

    public function getGrandTotalToBePaidAttribute(): float
    {
        return (float) bcsub((string) $this->grand_total, (string) $this->amount_paid_from_wallet, 2);
    }

    public function getTotalGradedItems(): int
    {
        return $this->orderItems()->where('order_item_status_id', OrderItemStatus::GRADED)->count();
    }

    /**
     * @return HasMany<OrderItem>
     */
    public function gradedOrderItems(): HasMany
    {
        return $this->orderItems()->where('order_item_status_id', OrderItemStatus::GRADED);
    }

    public function scopeStatus(Builder $query, string|int $status): Builder
    {
        return $query->whereHas(
            'orderStatus',
            function (Builder $query) use ($status) {
                if (! $status || $status === 'all') {
                    return $query->where('id', '>', OrderStatus::PAYMENT_PENDING);
                }

                return $query
                    ->where('id', $status)
                    ->orWhere('code', $status);
            }
        );
    }

    public function scopeCustomerName(Builder $query, string $customerName): Builder
    {
        return $query->whereHas(
            'user',
            fn ($query) => $query->where('first_name', 'like', "%$customerName%")->orWhere(
                'last_name',
                'like',
                "%$customerName%"
            )
        );
    }
    /**
     * @param  Builder<Order>  $query
     * @param  string  $coupon
     * @return Builder<Order>
     */
    public function scopePromoCode(Builder $query, string $coupon): Builder
    {
        return $query->whereHas(
            'coupon',
            fn ($query) => $query->where('code', 'like', "%$coupon%")
        );
    }

    public function scopeCustomerId(Builder $query, string $customerId): Builder
    {
        return $query->whereHas('user', fn ($query) => $query->where('id', $customerId));
    }

    /**
     * @param  Builder<Order>  $query
     * @param  string  $salesmanId
     * @return Builder<Order>
     */
    public function scopeSalesmanId(Builder $query, string $salesmanId): Builder
    {
        return $query->whereHas('salesman', fn ($query) => $query->where('id', $salesmanId));
    }

    public function missingItemsCount(): int
    {
        return $this->orderItems()->where('order_item_status_id', OrderItemStatus::MISSING)->count();
    }

    public function notAcceptedItemsCount(): int
    {
        return $this->orderItems()->where('order_item_status_id', OrderItemStatus::NOT_ACCEPTED)->count();
    }

    public function gradedItemsCount(): int
    {
        return $this->orderItems()->where('order_item_status_id', OrderItemStatus::GRADED)->count();
    }

    public function isEligibleToMarkAsGraded(): bool
    {
        return $this->orderItems()->count() === (
            $this->missingItemsCount() + $this->notAcceptedItemsCount() + $this->gradedItemsCount()
        );
    }

    public function orderShipment(): BelongsTo
    {
        return $this->belongsTo(OrderShipment::class);
    }

    public function orderCustomerShipment(): BelongsTo
    {
        return $this->belongsTo(OrderCustomerShipment::class);
    }

    public function getGroupedOrderItems(): Collection
    {
        return OrderItem::select(
            DB::raw('min(id) as id'),
            'card_product_id',
            DB::raw('min(order_id) as order_id'),
            DB::raw('min(order_item_status_id) as order_item_status_id'),
            DB::raw('sum(declared_value_per_unit) as declared_value_total'),
            DB::raw('min(declared_value_per_unit) as declared_value_per_unit'),
            DB::raw('sum(quantity) as quantity')
        )
            ->where('order_id', $this->id)
            ->groupBy(['card_product_id'])
            ->get();
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * @return BelongsTo<User, Order>
     */
    public function salesman(): BelongsTo
    {
        return $this->belongsTo(User::class, 'salesman_id');
    }

    /**
     * @param  Builder <Order> $query
     * @return Builder <Order>
     */
    public function scopeExcludeCancelled(Builder $query): Builder
    {
        return $query->where('order_status_id', '!=', OrderStatus::CANCELLED);
    }

    /**
    * @return Builder <Order>
    */
    public function exportQuery(): Builder
    {
        return self::query();
    }

    public function exportHeadings(): array
    {
        return ['Submission #', 'Placed', 'Reviewed', 'Customer', 'Cards', 'Status', 'Payment Status', 'Declared Value', 'Order Total'];
    }

    public function exportFilters(): array
    {
        return self::getAllowedAdminFilters();
    }

    public function exportSort(): array
    {
        return self::getAllowedAdminSorts();
    }

    public function exportIncludes(): array
    {
        return self::getAllowedAdminIncludes();
    }

    /**
     * @param  Order  $row
     * @return array
     */
    public function exportRowMap($row): array
    {
        return [
            $row->order_number,
            $row->created_at,
            $row->arrived_at,
            $row->user->customer_number,
            $row->orderItems->sum('quantity'),
            $row->orderStatus->name,
            $row->payment_status->toString(),
            $row->orderItems->sum('declared_value_total'),
            $row->grand_total,
        ];
    }

    public function isCancelled(): bool
    {
        return $this->order_status_id === OrderStatus::CANCELLED;
    }

    public function isPaid(): bool
    {
        return $this->payment_status->isPaid();
    }

    public function markAsPaid(): void
    {
        $this->payment_status = OrderPaymentStatusEnum::PAID;
        $this->paid_at = now();
        $this->save();

        GenerateOrderInvoice::dispatch($this);
    }

    public function hasInvoice(): bool
    {
        return $this->invoice()->exists();
    }

    public function hasCoupon(): bool
    {
        return $this->coupon()->exists();
    }

    public function hasCreditApplied(): bool
    {
        return $this->amount_paid_from_wallet > 0;
    }

    public function removeCouponApplied(): void
    {
        $this->coupon_id = null;
        $this->discounted_amount = 0;
        $this->save();
    }

    public function hasBillingAddress(): bool
    {
        return $this->billingAddress()->exists();
    }

    public function hasSameShippingAndBillingAddresses(): bool
    {
        return $this->shippingAddress()->is($this->billingAddress);
    }

    public function hasInsuredShipping(): bool
    {
        return $this->shippingMethod->code === ShippingMethod::INSURED_SHIPPING;
    }

    /**
     * @param  Builder <Order> $query
     * @return Builder <Order>
    */
    public function scopeForDate(Builder $query, string $date): Builder
    {
        return $query->whereDate('created_at', $date);
    }

    /**
     * @param  Builder <Order> $query
     * @return Builder <Order>
    */
    public function scopeForMonth(Builder $query, string $date): Builder
    {
        $monthStart = Carbon::parse($date)->firstOfMonth();
        $monthEnd = Carbon::parse($date)->endOfMonth();

        return $query->whereBetween('created_at', [$monthStart, $monthEnd]);
    }

    /**
     * @param  Builder <Order> $query
     * @return Builder <Order>
     */
    public function scopeBetweenDates(Builder $query, DateTime $fromDate, DateTime $toDate): Builder
    {
        return $query->whereBetween('created_at', [$fromDate, $toDate]);
    }

    public function isOlderThanOneDay(): bool
    {
        return now()->diff($this->created_at)->days > 0;
    }

    public function requiresCardCleaning(): bool
    {
        return $this->requires_cleaning;
    }

    public function isEligibleToMarkAsAssembled(): bool
    {
        return $this->orderStatus()->value('id') === OrderStatus::GRADED;
    }

    public function isEligibleToMarkAsShipped(): bool
    {
        return (
            $this->orderStatus()->value('id') === OrderStatus::ASSEMBLED && $this->isPaid()
        );
    }

    public function isShipped(): bool
    {
        return $this->order_status_id === OrderStatus::SHIPPED;
    }

    /**
     * @return HasOne<OrderCertificate>
     */
    public function orderCertificate(): HasOne
    {
        return $this->hasOne(OrderCertificate::class);
    }

    public function canBeGraded(): bool
    {
        return in_array(
            $this->order_status_id,
            [OrderStatus::CONFIRMED, OrderStatus::GRADED, OrderStatus::ASSEMBLED, OrderStatus::SHIPPED]
        );
    }

    public function isGradedOrShipped(): bool
    {
        return in_array(
            $this->order_status_id,
            [OrderStatus::GRADED, OrderStatus::ASSEMBLED, OrderStatus::SHIPPED]
        );
    }
}
