<?php

namespace App\Services\SalesmanCommission;

use App\Enums\Salesman\CommissionEarnedEnum;
use App\Models\Order;
use App\Models\SalesmanCommission;
use App\Models\SalesmanEarnedCommission;
use App\Models\User;
use App\Services\SalesmanCommission\OrderCommission\OrderCreateCommissionService;
use App\Services\SalesmanCommission\OrderCommission\OrderRefundCommissionService;
use Illuminate\Support\Facades\DB;

class SalesmanCommissionService
{
    protected static function storeSalesmanCommission(User $salesman, float $commission): void
    {
        $salesmanCommission = SalesmanCommission::updateOrCreate([
            'salesman_id' => $salesman->id,
            'event_at' => now()->toDateString(),
        ]);

        $salesmanCommission->increment('commission', $commission);
    }

    protected static function storeSalesmanEarnedCommission(Order $order, float $commission, int $type): void
    {
        SalesmanEarnedCommission::create([
            'salesman_id' => $order->salesman->id,
            'order_id' => $order->id,
            'type' => $type,
            'commission' => $commission
        ]);

    }

    public static function onOrderCreate(Order $order): void
    {
        DB::beginTransaction();

        $order->salesman_commission =  OrderCreateCommissionService::calculateCommission($order);
        $order->save();
        self::storeSalesmanEarnedCommission($order, $order->salesman_commission, CommissionEarnedEnum::ORDER_CREATED->value);
        self::storeSalesmanCommission($order->salesman, $order->salesman_commission);

        DB::commit();
    }

    public static function onOrderRefund(Order $order): void
    {
        DB::beginTransaction();

        $commission = OrderRefundCommissionService::calculateCommission($order);
        $order->salesman_commission -= $commission;
        $order->save();
        self::storeSalesmanEarnedCommission($order, -$commission, CommissionEarnedEnum::ORDER_REFUNDED->value);
        self::storeSalesmanCommission($order->salesman, -$commission);

        DB::commit();
    }
}
