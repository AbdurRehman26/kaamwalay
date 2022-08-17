<?php

namespace App\Jobs\Admin\Order;

use App\Models\Order;
use App\Services\Admin\Card\CreateCardLabelService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

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
     * @param  CreateCardLabelService  $createCardLabelService
     * @return void
     */
    public function handle(CreateCardLabelService $createCardLabelService): void
    {
        $createCardLabelService->createLabelForOrder($this->order);
    }
}
