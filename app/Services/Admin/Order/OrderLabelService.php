<?php

namespace App\Services\Admin\Order;

use App\Exceptions\Services\AGS\OrderLabelCouldNotBeGeneratedException;
use App\Exports\Order\OrdersLabelExport;
use App\Models\Order;
use App\Models\OrderLabel;
use App\Services\Admin\Card\CreateCardLabelService;
use App\Services\Admin\V1\OrderService;
use App\Services\AGS\AgsService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class OrderLabelService
{
    public function __construct(
        protected AgsService $agsService,
        protected OrderService $orderService,
        protected CreateCardLabelService $createCardLabelService
    ) {
    }

    /**
     * @throws OrderLabelCouldNotBeGeneratedException
     */
    public function generateLabel(Order $order): void
    {
        $this->createCardLabelService->createLabelsForOrder($order);

        $response = $this->getCardLabels($order);

        if (empty($response)) {
            throw new OrderLabelCouldNotBeGeneratedException(json_encode($response));
        }

        $this->generateFileUploadToCloudAndSaveLabel($order, $response);
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

    public function getCardLabels(Order $order): array
    {
        $labels = [];
        foreach ($order->gradedOrderItems as $orderItem) {
            $cardLabel = $orderItem->cardProduct->cardLabel->toArray();
            $cardLabel['label_line_one'] = $cardLabel['line_one'];
            $cardLabel['label_line_two'] = $cardLabel['line_two'];
            $cardLabel['label_line_three'] = $cardLabel['line_three'];
            $cardLabel['label_line_four'] = $cardLabel['line_four'];
            $cardLabel['card_number'] = $cardLabel['line_four'];
            $cardLabel['certificate_id'] = $orderItem->userCard->certificate_number;
            $cardLabel['final_grade'] = $orderItem->userCard->overall_grade;
            $cardLabel['grade_nickname'] = $orderItem->userCard->overall_grade_nickname;
            $labels[] = $cardLabel;
        }

        return $labels;
    }

    public function generateFileUploadToCloudAndSaveLabel(Order $order, array $response): string
    {
        $fileUrl = $this->generateFileAndUploadToCloud($order, $response);
        $this->saveCardLabel($order, $fileUrl);

        return $fileUrl;
    }
}
