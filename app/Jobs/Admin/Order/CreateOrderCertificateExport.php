<?php

namespace App\Jobs\Admin\Order;

use App\Models\Order;
use App\Services\Admin\Order\OrderCertificateService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateOrderCertificateExport implements ShouldQueue
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
     * @param  OrderCertificateService $orderCertificateService
     * @return void
     */
    public function handle(OrderCertificateService $orderCertificateService): void
    {
        $orderCertificateService->generateCertificateExport($this->order);
    }
}
