<?php

namespace App\Services\ReferrerCommission;

use App\Enums\Referrer\CommissionEarnedEnum;
use App\Models\CommissionStructure;
use App\Models\Order;
use App\Models\Referrer;
use App\Models\ReferrerEarnedCommission;
use App\Services\ReferrerCommission\OrderReferrerCommission\OrderCommissionService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReferrerCommissionService
{
    protected static function storeReferrerEarnedCommission(Order $order, Referrer $referrer, int $commissionStructureId, float $commission): void
    {
        ReferrerEarnedCommission::create([
            'referrer_id' => $referrer->id,
            'order_id' => $order->id,
            'commission_structure_id' => $commissionStructureId,
            'commission' => $commission,
        ]);
    }

    public static function onOrderLine(Order $order, Referrer $referrer, CommissionStructure $commissionStructure, CommissionEarnedEnum $orderCommissionType): void
    {
        try {
            DB::beginTransaction();

            $orderCommission = new OrderCommissionService();
            $commission = $orderCommission->getCommission($order, $commissionStructure, $orderCommissionType);

            self::storeReferrerEarnedCommission($order, $referrer, $commissionStructure->id, $commission);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
    }
}
