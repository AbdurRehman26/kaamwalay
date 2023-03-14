<?php

namespace App\Jobs\Admin\Order;

use App\Exceptions\Services\AGS\OrderLabelCouldNotBeGeneratedException;
use App\Models\Order;
use App\Services\Admin\Order\OrderLabelService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateOrderLabel implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;

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
     * @throws OrderLabelCouldNotBeGeneratedException
     */
    public function handle(OrderLabelService $orderLabelService): void
    {
        $orderLabelService->generateLabel($this->order);
    }
}
