<?php

namespace App\Jobs\Admin\Order;

use App\Services\Admin\Order\OrderLabelService;
use App\Exports\Order\OrdersLabelExport;
use App\Models\Order;
use App\Models\OrderLabel;
use App\Models\UserCard;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class CreateOrderLabel implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(protected Order $order)
    {
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(OrderLabelService $orderLabelService)
    {
        $response = $orderLabelService->getCardLabelData($this->order);
        $this->saveCardLabelToExcel($response);
    }
  
    protected function saveCardLabelToExcel(array $response): void
    {
        $filePath = 'order-labels/' . $this->order->order_number . '_label_' . Str::uuid() . '.xlsx';
        Excel::store(new OrdersLabelExport($response), $filePath, 's3', \Maatwebsite\Excel\Excel::XLSX);
        $filePathUrl = Storage::disk('s3')->url($filePath);
        $this->saveCardLabelData($filePathUrl);
    }

    protected function saveCardLabelData(string $filePathUrl): void
    {
        $orderLabel = new OrderLabel();
        $orderLabel->order_id = $this->order->id;
        $orderLabel->path = $filePathUrl;
        $orderLabel->save();
    }
}
