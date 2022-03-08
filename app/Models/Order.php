<?php

namespace App\Models;

use App\Concerns\ActivityLog;
use App\Concerns\Order\HasOrderPayments;
use App\Enums\Order\OrderPaymentStatusEnum;
use App\Http\Filters\AdminOrderSearchFilter;
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

class Order extends Model
{
    use HasFactory, ActivityLog, HasOrderPayments;

    const ORDER_STEPS = [
        'CARDS_SELECTION_STEP' => 'cardsSelectionStep',
        'SHIPPING_DETAILS_STEP' => 'shippingDetailsStep',
        'PROMO_DISCOUNT_STEP' => 'promoDiscountStep',
        'ORDER_REVIEW_STEP' => 'orderReviewStep',
        'ORDER_SUBMITTED_STEP' => 'orderSubmittedStep',
    ];

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
        'auto_saved_at',
        'extra_charge_total',
        'refund_total',
        'payment_method_discounted_amount',
        'order_step',
        'payment_status',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'shipping_fee' => 'float',
        'service_fee' => 'float',
        'grand_total' => 'float',
        'user_id' => 'integer',
        'payment_plan_id' => 'integer',
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
        'reviewed_at' => 'date',
        'graded_at' => 'date',
        'extra_charge_total' => 'float',
        'refund_total' => 'float',
        'payment_method_discounted_amount' => 'float',
        'amount_paid_from_wallet' => 'float',
        'paid_at' => 'datetime',
        'payment_status' => OrderPaymentStatusEnum::class,
    ];

    protected $appends = [
        'grand_total_cents',
        'grand_total_to_be_paid',
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
            AllowedFilter::scope('customer_id'),
            AllowedFilter::custom('search', new AdminOrderSearchFilter),
        ];
    }

    public static function getAllowedIncludes(): array
    {
        return [
            AllowedInclude::relationship('invoice'),
            AllowedInclude::relationship('paymentPlan'),
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
        ];
    }

    public static function getAllowedFilters(): array
    {
        return [
            AllowedFilter::partial('order_number'),
            AllowedFilter::partial('order_status_id'),
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paymentPlan(): BelongsTo
    {
        return $this->belongsTo(PaymentPlan::class);
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

    public function scopeForUser(Builder $query, User $user): Builder
    {
        return $query->where('orders.user_id', $user->id);
    }

    public function isPayable(string $version = 'v1'): bool
    {
        if ($version === 'v1') {
            return $this->order_status_id === OrderStatus::PAYMENT_PENDING;
        }

        return $this->order_status_id > OrderStatus::PAYMENT_PENDING
            && ! $this->isCancelled()
            && $this->payment_status === OrderPaymentStatusEnum::PENDING;
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
        return $this->grand_total - $this->amount_paid_from_wallet;
    }

    public function getTotalGradedItems(): int
    {
        return $this->orderItems()->where('order_item_status_id', OrderItemStatus::GRADED)->count();
    }

    public function scopeStatus(Builder $query, string|int $status): Builder
    {
        return $query->whereHas(
            'orderStatus',
            function (Builder $query) use ($status) {
                $query = $query->where('id', '>', OrderStatus::PAYMENT_PENDING);
                if (! $status || $status === 'all') {
                    return $query;
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

    public function scopeCustomerId(Builder $query, string $customerId): Builder
    {
        return $query->whereHas('user', fn ($query) => $query->where('id', $customerId));
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
     * @param  Builder <Order> $query
     * @return Builder <Order>
     */
    public function scopeValid(Builder $query): Builder
    {
        return $query->where('order_status_id', '!=', OrderStatus::CANCELLED);
    }

    public function isCancelled(): bool
    {
        return $this->order_status_id === OrderStatus::CANCELLED;
    }

    public function isPaid(): bool
    {
        return $this->payment_status === OrderPaymentStatusEnum::PAID;
    }

    public function markAsPaid(): void
    {
        $this->payment_status = OrderPaymentStatusEnum::PAID;
        $this->paid_at = now();
        $this->save();
    }
}
