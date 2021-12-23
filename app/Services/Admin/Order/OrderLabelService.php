<?php

namespace App\Services\Admin\Order;

use App\Exceptions\Services\AGS\AgsServiceIsDisabled;
use App\Models\Order;
use App\Models\UserCard;
use App\Services\AGS\AgsService;

class OrderLabelService
{
    public function __construct(protected AgsService $agsService)
    {
    }

    public function getCardLabelData(Order $order): array
    {
        if (! $this->agsService->isEnabled()) {
            logger('Skipping AgsService as it is disabled.');

            throw new AgsServiceIsDisabled;
        }
        
        $certList = UserCard::where('order_item_id', $order->id)->pluck('certificate_number');

        $response = $this->agsService->createCardLabel(
            data: array_merge(
                ['order_id' => $order->order_number],
                ['certificate_list' => $certList]
            )
        );

        return $response;
    }
}
