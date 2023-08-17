<?php

namespace App\Models;

use App\Concerns\ActivityLog;
use App\Enums\Order\OrderPaymentStatusEnum;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class OrderPayment extends Model
{
    use HasFactory, ActivityLog;

    public const TYPE_ORDER_PAYMENT = 1;

    public const TYPE_EXTRA_CHARGE = 2;

    public const TYPE_REFUND = 3;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'order_id',
        'payment_method_id',
        'request',
        'response',
        'payment_provider_reference_id',
        'notes',
        'amount',
        'type',
        'user_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'provider_fee' => 'float',
        'type' => 'integer',
        'amount' => 'float',
        'order_id' => 'integer',
        'user_id' => 'integer',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getPaymentType(int $type): string
    {
        return match ($type) {
            self::TYPE_EXTRA_CHARGE => 'extra_charge',
            self::TYPE_REFUND => 'refund',
            default => 'order_payment',
        };
    }

    public function scopeForDate(Builder $query, string $date): Builder
    {
        return $query->whereDate('order_payments.created_at', $date);
    }

    public function scopeForMonth(Builder $query, string $date): Builder
    {
        $monthStart = Carbon::parse($date)->firstOfMonth();
        $monthEnd = Carbon::parse($date)->endOfMonth();

        return $query->whereBetween('order_payments.created_at', [$monthStart, $monthEnd]);
    }

    public function scopeForValidPaidOrders(Builder $query): Builder
    {
        return $query->join('orders', function ($join) {
            $join->on('orders.id', '=', 'order_payments.order_id')
                ->where('orders.payment_status', OrderPaymentStatusEnum::PAID->value);
        });
    }

    /**
     * @param  Builder <OrderPayment>  $query
     * @return Builder <OrderPayment>
     */
    public function scopeIgnoreOrdersBySpecificAdmins(Builder $query): Builder
    {
        return $query->join('users', function ($join) {
            $join->on('orders.user_id', '=', 'users.id')
                ->whereNotIn(
                    'users.email',
                    Str::of(config('robograding.revenue_ignore_orders_admins'))->explode(',')->toArray()
                );
        });
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
