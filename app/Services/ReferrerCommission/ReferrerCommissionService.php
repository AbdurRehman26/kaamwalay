<?php

namespace App\Services\ReferrerCommission;

use App\Enums\Referrer\CommissionEarnedEnum;
use App\Models\CommissionStructure;
use App\Models\Order;
use App\Models\Referrer;
use App\Models\User;
use App\Models\ReferrerEarnedCommission;
use App\Services\ReferrerCommission\OrderReferrerCommission\OrderCommissionService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReferrerCommissionService
{
    protected static function storeReferrerEarnedCommission(Order $order, User $referrer, int $commissionStructureId, float $commission, CommissionEarnedEnum $orderCommissionType): void
    {
        ReferrerEarnedCommission::create([
            'referrer_id' => $referrer->referrer->id,
            'order_id' => $order->id,
            'commission_structure_id' => $commissionStructureId,
            'commission' => $commission,
            'type' => $orderCommissionType,
        ]);
    }

    protected static function updateOrderReferrerTotalCommission(Order $order, float $commission): void
    {
        $order->increment('referral_total_commission', $commission);
    }

    protected static function increaseReferrerValues(Referrer $referrer, float $commission): void
    {
        $referrer->update([
            'referral_orders' => $referrer->referral_orders + 1,
            'withdrawable_commission' => $referrer->withdrawable_commission + $commission,
        ]);
    }

    public static function onOrderLine(Order $order, User $referrer, CommissionStructure $commissionStructure, CommissionEarnedEnum $orderCommissionType): void
    {
        try {
            DB::beginTransaction();

            $orderCommission = new OrderCommissionService();
            $commission = $orderCommission->getCommission($order, $commissionStructure, $orderCommissionType);

            self::storeReferrerEarnedCommission($order, $referrer, $commissionStructure->id, $commission, $orderCommissionType);
            self::updateOrderReferrerTotalCommission($order, $commission);
            self::increaseReferrerValues($referrer->referrer, $commission);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
    }
}
