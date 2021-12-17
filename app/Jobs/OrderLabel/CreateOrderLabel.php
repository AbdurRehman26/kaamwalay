<?php

namespace App\Jobs\OrderLabel;

use App\Exports\LabelContentExport;
use App\Events\API\Order\OrderStatusChangedEvent;
use App\Services\AGS\AgsService;
use App\Models\Order;
use App\Models\OrderLabel;
use App\Models\UserCard;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
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
    public function handle(AgsService $agsService)
    {
        if (! $agsService->isEnabled()) {
            logger('Skipping AgsService as it is disabled.');

            return;
        }
        
        $certList = UserCard::where('order_item_id', $this->order->id)->pluck('certificate_number');

        $response = $agsService->createCardLabel(
            data: array_merge(
                ['order_id' => $this->order->order_number],
                ['certificate_list' => $certList]
            )
        );

      $this->saveCardLabelToExcel($response);

    }
  
    protected function saveCardLabelToExcel(array $response): void 
    {
      $filePath = 'order-label-contents/'.$this->order->order_number.'_label.xlsx';
      Excel::store(new LabelContentExport($response), $filePath, 's3', \Maatwebsite\Excel\Excel::XLSX);
      $filePathUrl = Storage::disk('s3')->url($filePath);
      $this->saveCardLabelData($filePathUrl);
    }

    protected function saveCardLabelData(string $filePathUrl): void
    {
      $orderLabels = new OrderLabel();
      $orderLabels->order_number = $this->order->order_number;
      $orderLabels->path = $filePathUrl;
      $orderLabels->save();
    }
}
