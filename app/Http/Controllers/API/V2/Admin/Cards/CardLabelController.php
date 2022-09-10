<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Exceptions\API\Admin\CardLabelsCanNotBeExportedForOrder;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\CardLabel\UpdateCardLabelRequest;
use App\Http\Requests\API\V2\Admin\CardLabel\UpdateOrderLabelsRequest;
use App\Http\Resources\API\V2\Admin\CardLabel\CardLabelResource;
use App\Http\Resources\API\V2\Admin\UserCard\UserCardLabelCollection;
use App\Models\CardLabel;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\Card\CardLabelService;
use App\Services\Admin\Order\OrderLabelService;
use Illuminate\Http\JsonResponse;

class CardLabelController extends Controller
{
    public function __construct(protected CardLabelService $cardLabelService, protected OrderLabelService $orderLabelService)
    {
    }

    /**
     * @param  Order  $order
     * @return UserCardLabelCollection
     * @throws CardLabelsCanNotBeExportedForOrder
     */
    public function getOrderLabels(Order $order): UserCardLabelCollection
    {
        //throw error if order is not graded yet
        if (! in_array($order->order_status_id, [OrderStatus::GRADED, OrderStatus::SHIPPED])) {
            throw new CardLabelsCanNotBeExportedForOrder;
        }

        return new UserCardLabelCollection(
            $this->cardLabelService->getOrderLabels($order)
        );
    }

    public function updateAndExportOrderLabels(UpdateOrderLabelsRequest $request, Order $order): JsonResponse
    {
        //throw error if order is not graded yet
        if (! in_array($order->order_status_id, [OrderStatus::GRADED, OrderStatus::SHIPPED])) {
            throw new CardLabelsCanNotBeExportedForOrder;
        }

        return new JsonResponse(
            [
                'message' => 'OK',
                'url' => $this->cardLabelService->updateAndExportLabels($order, $request->data),
            ],
            200
        );
    }

    public function getCardProductLabel(CardProduct $cardProduct): CardLabelResource
    {
        return new CardLabelResource($this->cardLabelService->getOrCreateCardProductLabel($cardProduct));
    }

    public function update(UpdateCardLabelRequest $request, CardLabel $label): CardLabelResource
    {
        return new CardLabelResource($this->cardLabelService->updateCardLabel($label, $request->except('id')));
    }
}
