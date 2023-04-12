<?php

namespace App\Http\Controllers\API\V3\Admin\Order;

use App\Exceptions\API\Admin\IncorrectOrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\Order\MarkOrderAsAbandonedRequest;
use App\Http\Requests\API\V3\Admin\Order\StoreOrderRequest;
use App\Http\Requests\API\V3\Admin\Order\UpdateShippingAddressRequest;
use App\Http\Resources\API\V3\Admin\Order\OrderCreateResource;
use App\Http\Resources\API\V3\Admin\Order\UserCardResource;
use App\Http\Resources\API\V3\Admin\OrderListCollection;
use App\Http\Resources\API\V3\Admin\OrderResource;
use App\Jobs\Admin\Order\GetCardGradesFromAgs;
use App\Models\Order;
use App\Services\Admin\V3\CreateOrderService;
use App\Services\Admin\V3\OrderService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
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

    public function updateShippingAddress(Order $order, UpdateShippingAddressRequest $request): JsonResponse
    {
        $this->orderService->updateShippingAddress($order, $request->validated());

        return new JsonResponse([
            'success' => true,
            'message' => 'Shipping Address Updated successfully.',
        ]);
    }

    public function markAsAbandoned(MarkOrderAsAbandonedRequest $request): JsonResponse
    {
        $this->orderService->attachTags($request->items);

        return new JsonResponse([
            'success' => true,
            'message' => 'Order Abandoned successfully.',
        ]);
    }

    public function markAsUnAbandoned(Request $request): JsonResponse
    {
        $this->orderService->detachTags($request->items);

        return new JsonResponse([
            'success' => true,
            'message' => 'Order Abandoned successfully.',
        ]);
    }

    public function getGrades(Request $request, Order $order): AnonymousResourceCollection | JsonResponse
    {
        $this->authorize('review', $order);

        try {
            GetCardGradesFromAgs::dispatchIf(
                $order->canBeGraded() && $request->boolean('from_ags', true),
                $order
            );
            $userCards = $this->orderService->getPaginatedCardsForGrading($order);
        } catch (IncorrectOrderStatus $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                $e->getCode()
            );
        }

        return UserCardResource::collection($userCards);
    }
}
