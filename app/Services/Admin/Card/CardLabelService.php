<?php

namespace App\Services\Admin\Card;

use App\Http\Resources\API\V2\Admin\CardLabel\CardLabelResource;
use App\Models\CardLabel;
use App\Models\CardProduct;
use App\Services\AGS\AgsService;
use Illuminate\Database\Eloquent\Collection;
use Spatie\QueryBuilder\QueryBuilder;

class CardLabelService
{
    public function __construct(protected AgsService $agsService, protected CreateCardLabelService $createCardLabelService)
    {
    }

    public function search(): Collection
    {
        $query = CardLabel::query();

        $cardProductIds = [];
        if (request('order_id')) {
            $cardProductIds = CardProduct::join('order_items', 'order_items.card_product_id', 'card_products.id')
                ->where('order_id', request('order_id'))->select('card_products.*')->pluck('id')->toArray();
        }

        if (count($cardProductIds) > 0) {
            $query->whereIn('card_product_id', $cardProductIds);
        }

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
