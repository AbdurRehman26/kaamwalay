<?php

namespace App\Services\Admin\Order;

use App\Exceptions\Services\AGS\AgsServiceIsDisabled;
use App\Exceptions\Services\AGS\OrderLabelCouldNotBeGeneratedException;
use App\Exports\Order\OrdersLabelExport;
use App\Models\Order;
use App\Models\OrderLabel;
use App\Services\Admin\V1\OrderService;
use App\Services\AGS\AgsService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class OrderLabelService
{
    public function __construct(
        protected AgsService $agsService,
        protected OrderService $orderService
    ) {
    }

    /**
     * @throws AgsServiceIsDisabled
     * @throws OrderLabelCouldNotBeGeneratedException
     */
    public function generateLabel(Order $order): void
    {
        if (! $this->agsService->isEnabled()) {
            logger('Skipping AgsService as it is disabled.');

            throw new AgsServiceIsDisabled;
        }

        $certList = $this->orderService->getOrderCertificates($order);

        $response = $this->agsService->createCardLabel([
            'order_id' => $order->order_number,
            'certificate_list' => $certList,
        ]);

        if (empty($response) || $response['app_status'] !== 1) {
            throw new OrderLabelCouldNotBeGeneratedException(json_encode($response));
        }

        $fileUrl = $this->generateFileAndUploadToCloud($order, $response);
        $this->saveCardLabel($order, $fileUrl);
    }

    protected function generateFileAndUploadToCloud(Order $order, array $response): string
    {
        $filePath = 'order-labels/' . $order->order_number . '_label_' . Str::uuid() . '.xlsx';
        Excel::store(new OrdersLabelExport($response), $filePath, 's3', \Maatwebsite\Excel\Excel::XLSX);

        return Storage::disk('s3')->url($filePath);
    }

    protected function saveCardLabel(Order $order, string $fileUrl): void
    {
        OrderLabel::updateOrCreate(
            [
                'order_id' => $order->id,
            ],
            [
                'path' => $fileUrl,
            ]
        );
    }
}
