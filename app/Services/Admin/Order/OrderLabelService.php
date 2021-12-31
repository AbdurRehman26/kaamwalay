<?php

namespace App\Services\Admin\Order;

use App\Exceptions\Services\AGS\AgsServiceIsDisabled;
use App\Models\Order;
use App\Services\Admin\OrderService;
use App\Services\AGS\AgsService;

class OrderLabelService
{
    public function __construct(
        protected AgsService $agsService,
        protected OrderService $orderService
    ) {
    }

    public function getCardLabelData(Order $order): array
    {
        if (! $this->agsService->isEnabled()) {
            logger('Skipping AgsService as it is disabled.');

            throw new AgsServiceIsDisabled;
        }
        
        $certList = $this->orderService->getOrderCertificates($order);

        $response = $this->agsService->createCardLabel(
            data: array_merge(
                ['order_id' => $order->order_number],
                ['certificate_list' => $certList]
            )
        );

        return $response;
    }
}
