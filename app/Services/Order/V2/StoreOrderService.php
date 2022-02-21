<?php

namespace App\Services\Order\V2;

use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\V2\OrderStatusHistoryService;
use App\Services\Order\OrderNumberGeneratorService;
use function auth;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use Throwable;

class StoreOrderService
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
    public function create(array $data): Order
    {
        $this->data = $data;

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

        $this->startOrder();
        $this->storePaymentPlan($this->data['payment_plan']);
        $this->saveOrder();

        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::DEFAULT_ORDER_STATUS, $this->order);

        DB::commit();
    }

    protected function startOrder(): void
    {
        $this->order = new Order();
    }

    protected function storePaymentPlan(array $paymentPlan): void
    {
        $this->order->payment_plan_id = $paymentPlan['id'];
    }

    protected function saveOrder(): void
    {
        $this->order->user()->associate(auth()->user());
        $this->order->save();
        $this->order->order_number = OrderNumberGeneratorService::generate($this->order);
        $this->order->save();
    }
}
