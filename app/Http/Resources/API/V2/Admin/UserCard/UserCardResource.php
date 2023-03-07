<?php

namespace App\Http\Resources\API\V2\Admin\UserCard;

use App\Http\Resources\API\BaseResource;
use App\Models\CardProduct;
use App\Models\UserCard;
use Illuminate\Http\Request;

/**
 * @mixin UserCard
 */
class UserCardResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        /** @var CardProduct $cardProduct */
        $cardProduct = $this->orderItem->cardProduct;

        return [
            'certificate_number' => $this->certificate_number,
            'grade' => $this->resource->overall_grade,
            'nickname' => $this->overall_grade_nickname,
            'card_name' => $cardProduct->name,
            'category_name' => $cardProduct->cardCategory?->name,
            'category_type' => $cardProduct->cardCategory?->cardCategoryType?->name,
            'set_name' => $cardProduct->cardSet?->name,
            'set_cards_number' => $cardProduct->cardSet?->cards_number,
            'series_name' => $cardProduct->cardSet?->cardSeries?->name,
            'release_date' => $this->formatDate($cardProduct->cardSet?->release_date),
            'release_year' => $cardProduct->cardSet?->release_year,
            'card_number_order' => $cardProduct->getFormattedCardNumber(),
            'image_path' => $cardProduct->image_path,
            'rarity' => $cardProduct->rarity,
            'language' => $cardProduct->language,
            'variant' => $cardProduct->variant,
            'surface' => $cardProduct->surface,
            'edition' => $cardProduct->edition,
        ];
    }
}
