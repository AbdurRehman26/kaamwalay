<?php

namespace App\Jobs\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderFoldersOnDropboxNotCreated;
use App\Models\Order;
use App\Services\Admin\V1\OrderService;
use App\Services\Dropbox\DropboxService;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Spatie\Dropbox\Exceptions\BadRequest;
use Throwable;

class CreateOrderFoldersOnDropbox implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;
    public int $maxExceptions = 3;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(protected Order $order, protected ?string $asyncJobId = null)
    {
        //
    }

    /**
     * Execute the job.
     *
     * @throws OrderFoldersOnDropboxNotCreated|Throwable
     */
    public function handle(OrderService $orderService, DropboxService $dropboxService): void
    {
        // If asyncJobId exists, job previously ran for folders creation, so we need to inquire status from Dropbox
        if (! empty($this->asyncJobId )) {
            $response = $dropboxService->checkFolderBatchStatus($this->asyncJobId);

            if (empty($response['.tag']) || $response['.tag'] === 'other') {
                Log::error('Folders could not be created on Dropbox.', [
                    'order_id' => $this->order->id,
                    'response' => $response,
                ]);

                throw new OrderFoldersOnDropboxNotCreated;
            }

            // If status is in progress, push job back to queue to run after 5 seconds for inquiring status again
            if ($response['.tag'] === 'in_progress') {
                $this->release(5);
            }

            return;
        }

        // If asyncJobId does not exist, job is running first time, so we need to create folders
        // Create a folder with order number, and certificates folders inside it
        $folders = [$this->order->order_number];
        $certificates = $orderService->getOrderCertificates($this->order);

        foreach ($certificates as $certificate) {
            $folders[] = "{$this->order->order_number}/$certificate";
        }

        try {
            $response = $dropboxService->createFolderBatch($folders);

            if (empty($response['.tag']) || $response['.tag'] === 'other') {
                Log::error('Folders could not be created on Dropbox.', [
                    'order_id' => $this->order->id,
                    'response' => $response,
                    'folders' => $folders,
                ]);

                throw new OrderFoldersOnDropboxNotCreated;
            }

            // If Dropbox returned too many requests error, retry job after 5 seconds
            if (
                ! empty($response['.tag'])
                && ! empty($response['entries'][0]['failure']['path']['.tag'])
                && $response['entries'][0]['failure']['path']['.tag'] === 'too_many_write_operations'
            ) {
                $this->release(5);
            }

            // Dropbox either processes synchronously or asynchronously
            // If it processes asynchronously, it provides async job id, so we dispatch the job again with async job id to inquire status
            if ($response['.tag'] === 'async_job_id') {
                CreateOrderFoldersOnDropbox::dispatch($this->order, $response['async_job_id']);
            }
        } catch (BadRequest $e) {
            Log::error('Folders could not be created on Dropbox.', [
                'order_id' => $this->order->id,
                'error' => $e->response->getBody(),
                'folders' => $folders,
            ]);

            throw new OrderFoldersOnDropboxNotCreated;
        } catch (Exception $e) {
            Log::error('Folders could not be created on Dropbox.', [
                'order_id' => $this->order->id,
                'error' => $e->getMessage(),
                'folders' => $folders,
            ]);

            throw new OrderFoldersOnDropboxNotCreated;
        }
    }
}
