<?php

namespace App\Services\Order\V2;

use App\Enums\Order\OrderStepEnum;
use App\Events\API\Customer\Order\OrderPlaced;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\V2\OrderStatusHistoryService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class CompleteOrderSubmissionService
{
    protected Order $order;
    protected array $data;

    public function __construct(
        private OrderStatusHistoryService $orderStatusHistoryService,
    ) {
    }

    /**
     * @throws Exception
     */
    public function complete(Order $order): Order
    {
        $this->order = $order;

        try {
            $this->process();

            return $this->order;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
    }

    /**
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    protected function process(): void
    {
        DB::beginTransaction();

        $this->saveOrder();
        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::PLACED, $this->order);
        OrderPlaced::dispatch($this->order);

        DB::commit();
    }

    protected function saveOrder(): void
    {
        $this->order->order_step = OrderStepEnum::ORDER_SUBMITTED_STEP;
        $this->order->order_status_id = OrderStatus::PLACED;
        $this->order->save();
    }
}
