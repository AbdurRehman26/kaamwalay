<?php

namespace App\Services\Admin\V2;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Events\API\Order\V2\OrderStatusChangedEvent;
use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsAssembled;
use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsGraded;
use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsShipped;
use App\Exceptions\API\Admin\OrderCanNotBeMarkedAsReviewed;
use App\Jobs\Admin\Order\CreateOrderCertificateExport;
use App\Jobs\Admin\Order\CreateOrderFoldersOnAGSLocalMachine;
use App\Jobs\Admin\Order\CreateOrderFoldersOnDropbox;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Services\Admin\V1\OrderStatusHistoryService as V1OrderStatusHistoryService;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Log;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class OrderStatusHistoryService extends V1OrderStatusHistoryService
{
    /**
     * @throws OrderCanNotBeMarkedAsGraded|Throwable
     */
    public function addStatusToOrder(
        OrderStatus|int $orderStatus,
        Order|int $order,
        User|int $user = null,
        ?string $notes = null
    ): OrderStatusHistory|Model {
        if (! $user) {
            /** @noinspection CallableParameterUseCaseInTypeContextInspection */
            $user = auth()->user();
        }

        $orderId = getModelId($order);
        $order = Order::find($orderId);
        $orderStatusId = getModelId($orderStatus);

        $orderStatusHistory = OrderStatusHistory::where('order_id', getModelId($order))
            ->where('order_status_id', getModelId($orderStatus))
            ->first();

        throw_if(
            getModelId($orderStatus) === OrderStatus::GRADED && ! Order::find($orderId)->isEligibleToMarkAsGraded(),
            OrderCanNotBeMarkedAsGraded::class
        );

        throw_if(
            (
                getModelId($orderStatus) === OrderStatus::ASSEMBLED && ! $order->isEligibleToMarkAsAssembled()
            ),
            OrderCanNotBeMarkedAsAssembled::class
        );

        throw_if(
            (getModelId($orderStatus) === OrderStatus::SHIPPED && ! $order->isEligibleToMarkAsShipped()),
            OrderCanNotBeMarkedAsShipped::class
        );

        if ($orderStatusId === OrderStatus::CONFIRMED) {
            $data = $this->orderService->getOrderCertificatesData($order);

            $response = $this->agsService->createCertificates($data);
            throw_if(empty($response), OrderCanNotBeMarkedAsReviewed::class);

            CreateOrderFoldersOnAGSLocalMachine::dispatch($order);
            CreateOrderFoldersOnDropbox::dispatch($order);
            CreateOrderCertificateExport::dispatch($order);
        }

        if ($orderStatusId === OrderStatus::GRADED) {
            if (! $order->isPaid()) {
                $order->payment_status = OrderPaymentStatusEnum::DUE;
                $order->save();
            }
        }

        $order = Order::where('id', $orderId)->first();
        $order->update([
            'order_status_id' => $orderStatusId,
        ]);

        if (! $orderStatusHistory) {
            $orderStatusHistory = OrderStatusHistory::create([
                'order_id' => $orderId,
                'order_status_id' => $orderStatusId,
                'user_id' => getModelId($user),
                'notes' => $notes,
            ]);
        }

        $this->updateStatusDateOnOrder($order, $orderStatusHistory);

        if ($orderStatusId === OrderStatus::CONFIRMED) {
            $this->addEstimatedDeliveryDateToOrder($order);
        }

        // TODO: replace find with the model.
        OrderStatusChangedEvent::dispatch(Order::find($orderId), OrderStatus::find($orderStatusId));

        if (getModelId($orderStatus) === OrderStatus::SHIPPED) {
            $orderStatusHistory->user_id = getModelId($user);
            $orderStatusHistory->notes = $notes;
            $orderStatusHistory->save();
        }

        return QueryBuilder::for(OrderStatusHistory::class)
            ->where('id', $orderStatusHistory->id)
            ->allowedIncludes(OrderStatusHistory::getAllowedAdminIncludes())
            ->first();
    }

    protected function updateStatusDateOnOrder(Order $order, OrderStatusHistory $orderStatusHistory): void
    {
        $date = $orderStatusHistory->created_at;

        match ($order->order_status_id) {
            OrderStatus::CONFIRMED => [
                $order->arrived_at = $date,
                $order->reviewed_at = $date,
            ],
            OrderStatus::GRADED => $order->graded_at = $date,
            OrderStatus::SHIPPED => $order->shipped_at = $date,
            default => null,
        };

        $order->save();
    }

    protected function addEstimatedDeliveryDateToOrder(Order $order): void
    {
        try {
            $paymentPlan = $order->originalPaymentPlan;

            $order->estimated_delivery_start_at = Carbon::now()->addWeekdays($paymentPlan->estimated_delivery_days_min);
            $order->estimated_delivery_end_at = Carbon::now()->addWeekdays($paymentPlan->estimated_delivery_days_max);
            $order->save();
        } catch (Exception $e) {
            Log::error('Could Not Calculate Order Estimated Date :' . $order->order_number, [
                'message' => $e->getMessage(),
            ]);
            report($e);
        }
    }
}
