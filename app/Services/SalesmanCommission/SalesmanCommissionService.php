<?php

namespace App\Services\SalesmanCommission;

use App\Enums\Salesman\CommissionEarnedEnum;
use App\Models\Order;
use App\Models\SalesmanCommission;
use App\Models\SalesmanEarnedCommission;
use App\Models\User;
use App\Services\SalesmanCommission\OrderExtraChargeCommission\OrderCommissionService;
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

    public static function onOrderLine(Order $order, CommissionEarnedEnum $orderCommissionType): void
    {
        DB::beginTransaction();

        $orderCommission = new OrderCommissionService();
        $commission = $orderCommission->getCommission($order, $orderCommissionType);
        $order->salesman_commission = $commission;
        $order->save();

        self::storeSalesmanEarnedCommission($order, $commission, $orderCommissionType->value);
        self::storeSalesmanCommission($order->salesman, $commission);

        DB::commit();
    }
}
