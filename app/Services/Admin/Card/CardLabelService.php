<?php

namespace App\Services\Admin\Card;

use App\Http\Resources\API\V2\Admin\CardLabel\CardLabelResource;
use App\Models\CardLabel;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItemStatus;
use App\Models\UserCard;
use App\Services\AGS\AgsService;
use Illuminate\Database\Eloquent\Collection;
use Spatie\QueryBuilder\QueryBuilder;

class CardLabelService
{
    public function __construct(protected AgsService $agsService, protected CreateCardLabelService $createCardLabelService)
    {
    }

    public function getOrderGradedCards(Order $order): Collection
    {
        $query = UserCard::join('order_items', 'order_items.id', 'user_cards.order_item_id')
            ->where('order_id', $order->id)
            ->where('order_items.order_item_status_id', OrderItemStatus::GRADED)
            ->select('user_cards.*');

        return QueryBuilder::for($query)->get();
    }

    public function getOrCreateCardProductLabel(CardProduct $cardProduct): CardLabel
    {
        if ($cardProduct->cardLabel()->exists()) {
            return $cardProduct->cardLabel;
        }

        return $this->createCardLabelService->createLabel($cardProduct);
    }

    public function updateCardLabel(CardLabel $cardLabel, array $data): CardLabel
    {
        $cardLabel->update($data);

        return $cardLabel->fresh();
    }
}
