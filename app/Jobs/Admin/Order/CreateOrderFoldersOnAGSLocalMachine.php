<?php

namespace App\Jobs\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderFoldersOnAGSLocalMachineNotCreated;
use App\Models\Order;
use App\Services\Admin\V2\OrderService;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class CreateOrderFoldersOnAGSLocalMachine implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public const ENDPOINT = '/create_folders';
    public int $tries = 5;
    public int $maxExceptions = 3;
    protected string $baseUrl;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(protected Order $order)
    {
        $this->baseUrl = config('services.agsLocalMachineFolderCreation.base_url');
    }

    /**
     * Execute the job.
     *
     * @throws OrderFoldersOnAGSLocalMachineNotCreated|Throwable
     */
    public function handle(OrderService $orderService): void
    {
        $folders = [$this->order->order_number];
        $certificates = $orderService->getOrderCertificates($this->order);

        foreach ($certificates as $certificate) {
            $folders[] = "{$this->order->order_number}/$certificate";
        }
        try {
            $response = Http::post($this->baseUrl . self::ENDPOINT, $folders);

            if ($response->status() !== 200) {
                $this->release(5);
            }
        } catch (Exception $e) {
            Log::error('Folders could not be created on AGS local machine.', [
                'order_id' => $this->order->id,
                'error' => $e->getMessage(),
                'folders' => $folders,
            ]);

            throw new OrderFoldersOnAGSLocalMachineNotCreated;
        }
    }
}
