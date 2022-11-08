<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Exceptions\API\Admin\Order\OrderCanNotBeCancelled;
use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsShipped;
use App\Exceptions\API\Admin\Order\OrderIsAlreadyCancelled;
use App\Exceptions\API\Admin\Order\OrderLabelCanNotBeGenerated;
use App\Exceptions\API\Admin\Order\ShipmentNotUpdated;
use App\Exceptions\Services\AGS\AgsServiceIsDisabled;
use App\Exceptions\Services\AGS\OrderLabelCouldNotBeGeneratedException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Order\StoreOrderRequest;
use App\Http\Requests\API\V2\Admin\Order\UpdateBillingAddressRequest;
use App\Http\Requests\API\V2\Admin\Order\UpdateNotesRequest;
use App\Http\Requests\API\V2\Admin\Order\UpdateShipmentRequest;
use App\Http\Resources\API\V2\Admin\Order\OrderCreateResource;
use App\Http\Resources\API\V2\Admin\Order\OrderListCollection;
use App\Http\Resources\API\V2\Admin\Order\OrderResource;
use App\Http\Resources\API\V2\Admin\Order\OrderShipmentResource;
use App\Http\Resources\API\V2\Admin\Order\UserCardCollection;
use App\Jobs\Admin\Order\GetCardGradesFromAgs;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\Order\OrderLabelService;
use App\Services\Admin\Order\ShipmentService;
use App\Services\Admin\V2\CreateOrderService;
use App\Services\Admin\V2\OrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
    }

    /**
     * @throws Throwable
     */
    public function processShipment(UpdateShipmentRequest $request, Order $order): OrderResource | JsonResponse
    {
        throw_unless($order->isPaid(), OrderCanNotBeMarkedAsShipped::class);

        try {
            DB::beginTransaction();
            /** @var OrderService $orderService */
            $orderService = resolve(OrderService::class);

            $orderService->shipOrder(
                $order,
                $request->only('shipping_provider', 'tracking_number')
            );

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $order->refresh()->load('orderShipment');

        return new OrderResource($order);
    }

    public function index(): OrderListCollection
    {
        $orders = $this->orderService->getOrders();

        return new OrderListCollection($orders);
    }

    public function show(int $orderId): OrderResource
    {
        $order = $this->orderService->getOrder($orderId);

        return new OrderResource($order);
    }


    public function store(StoreOrderRequest $request): OrderCreateResource | JsonResponse
    {
        try {
            $createOrderService = resolve(CreateOrderService::class);

            $order = $createOrderService->create($request->validated());
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new OrderCreateResource($order);
    }

    /**
     * @throws Throwable
     */
    public function destroy(Order $order): JsonResponse
    {
        throw_if($order->isPaid(), OrderCanNotBeCancelled::class);
        throw_if($order->isCancelled(), OrderIsAlreadyCancelled::class);

        /** @var OrderService $orderService */
        $orderService = resolve(OrderService::class);

        try {
            DB::beginTransaction();

            $orderService->cancelOrder($order, auth()->user());

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Failed to cancel order $order->id", [
                'message' => $e->getMessage(),
            ]);

            return new JsonResponse(['message' => 'Failed to cancel order.'], $e->getCode());
        }

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    /**
     * @throws OrderLabelCouldNotBeGeneratedException
     * @throws AgsServiceIsDisabled
     * @throws Throwable
     */
    public function generateLabel(Order $order): OrderResource
    {
        throw_if(
            $order->order_status_id < OrderStatus::GRADED || $order->order_status_id === OrderStatus::CANCELLED,
            new OrderLabelCanNotBeGenerated
        );

        /** @var OrderLabelService $orderLabelService */
        $orderLabelService = resolve(OrderLabelService::class);

        $orderLabelService->generateLabel($order);

        $order->load('orderLabel');

        return new OrderResource($order);
    }

    public function updateBillingAddress(Order $order, UpdateBillingAddressRequest $request): JsonResponse
    {
        /** @var OrderService $orderService */
        $orderService = resolve(OrderService::class);
        $orderService->updateBillingAddress($order, $request->validated());

        return new JsonResponse([
            'success' => true,
            'message' => 'Billing Address Updated successfully.',
        ]);
    }

    public function updateShipment(UpdateShipmentRequest $request, Order $order, ShipmentService $shipmentService): OrderShipmentResource | JsonResponse
    {
        try {
            $result = $shipmentService->updateShipment($order, $request->shipping_provider, $request->tracking_number);
        } catch (ShipmentNotUpdated $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new OrderShipmentResource($result);
    }

    public function updateNotes(UpdateNotesRequest $request, Order $order): OrderResource
    {
        return new OrderResource($this->orderService->updateNotes($order, $request->notes));
    }

    public function getGrades(Request $request, Order $order): UserCardCollection | JsonResponse
    {
        $this->authorize('review', $order);

        try {
            GetCardGradesFromAgs::dispatchIf(
                $order->canBeGraded() && $request->boolean('from_ags', true),
                $order
            );
            $userCards = $this->orderService->getCardsForGrading($order);
        } catch (IncorrectOrderStatus $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                $e->getCode()
            );
        }

        return new UserCardCollection($userCards);
    }
}
