<?php

namespace App\Jobs\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderFoldersOnDropboxNotCreated;
use App\Models\Order;
use App\Services\Admin\V1\OrderService;
use App\Services\DropboxService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class CreateOrderFoldersOnDropbox implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 5;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(protected Order $order)
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     * @throws OrderFoldersOnDropboxNotCreated|Throwable
     */
    public function handle(OrderService $orderService, DropboxService $dropboxService)
    {
        // It creates a folder with order number, and certificates folders inside it
        $folders = [$this->order->order_number];
        $certificates = $orderService->getOrderCertificates($this->order);

        foreach ($certificates as $certificate) {
            $folders[] = "{$this->order->order_number}/$certificate";
        }

        throw_unless($dropboxService->createFolderBatch($folders), OrderFoldersOnDropboxNotCreated::class);
    }
}
