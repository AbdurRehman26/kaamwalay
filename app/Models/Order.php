<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property OrderStatusHistory[] $orderStatusHistory
 * @property OrderStatus $orderStatus
 * @property float $grand_total
 * @property PaymentMethod $paymentMethod
 * @property OrderPayment $orderPayment
 * @property int $order_status_id
 */
class Order extends Model
{
    use HasFactory;

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
        'invoice_id',
        'arrived_at',
        'notes',
        'reviewed_by_id',
        'graded_by_id',
        'reviewed_at',
        'graded_at',
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
        'order_status_id' => 'integer',
        'arrived_at' => 'date',
        'reviewed_by_id' => 'integer',
        'graded_by_id' => 'integer',
        'grand_total_cents' => 'integer',
        'reviewed_at' => 'date',
        'graded_at' => 'date',
    ];

    protected $appends = ['grand_total_cents'];

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

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderPayment(): HasOne
    {
        return $this->hasOne(OrderPayment::class);
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

    public function isPayable(): bool
    {
        return $this->order_status_id === OrderStatus::PAYMENT_PENDING;
    }

    public function scopePlaced(Builder $query): Builder
    {
        return $query->whereHas('orderStatusHistory', function ($query) {
            return $query->where('order_status_id', OrderStatus::PLACED);
        });
    }

    public function getGrandTotalCentsAttribute(): int
    {
        return $this->grand_total * 100;
    }

    public function scopeStatus(Builder $query, string | int $status): Builder
    {
        if (! $status || $status === 'all') {
            return $query;
        }

        return $query->whereHas(
            'orderStatusHistory.orderStatus',
            fn ($query) => $query
                ->where('id', $status)
                ->orWhere('code', $status)
        );
    }

    public function scopeCustomerName(Builder $query, string $customerName): Builder
    {
        return $query->whereHas(
            'user',
            fn ($query) => $query->where('first_name', 'like', "%$customerName%")->orWhere('last_name', 'like', "%$customerName%")
        );
    }

    public function scopeCustomerId(Builder $query, string $customerId): Builder
    {
        return $query->whereHas('user', fn ($query) => $query->where('id', $customerId));
    }
}
