<?php

namespace App\Jobs\Admin\Order;

use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Models\Order;
use App\Services\Admin\V2\OrderService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GetCardGradesFromAgs implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;
    public int $backoff = 300; //seconds

    public function __construct(public Order $order)
    {
    }

    /**
     * @throws IncorrectOrderStatus
     */
    public function handle(OrderService $orderService): void
    {
        $orderService->getGrades($this->order);
    }
}
