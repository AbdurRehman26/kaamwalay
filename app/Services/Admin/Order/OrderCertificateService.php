<?php

namespace App\Services\Admin\Order;

use App\Exports\Order\OrdersCertificateExport;
use App\Models\Order;
use App\Models\OrderCertificate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Excel as ExcelWriter;
use Maatwebsite\Excel\Facades\Excel;

class OrderCertificateService
{
    public function generateCertificateExport(Order $order): void
    {
        $fileUrl = $this->generateFileAndUploadToCloud($order);
        $this->saveOrderCertificateExport($order, $fileUrl);
    }

    protected function generateFileAndUploadToCloud(Order $order): string
    {
        $filePath = 'order-certificates/' . $order->order_number . '_certificate_' . Str::uuid() . '.xlsx';
        Excel::store(new OrdersCertificateExport($order), $filePath, 's3', ExcelWriter::XLSX);

        return Storage::disk('s3')->url($filePath);
    }

    protected function saveOrderCertificateExport(Order $order, string $fileUrl): void
    {
        OrderCertificate::updateOrCreate(
            [
                'order_id' => $order->id,
            ],
            [
                'path' => $fileUrl,
            ]
        );
    }
}
