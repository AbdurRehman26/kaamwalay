<?php

namespace App\Http\Resources\API\V2\Admin\UserCard;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\CardProduct\CardProductResource;
use App\Models\CardProduct;
use App\Models\UserCard;
use Illuminate\Http\Request;

/**
 * @mixin UserCard
 */
class UserCardLabelResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        /** @var CardProduct $cardProduct */
        $cardProduct = $this->orderItem->cardProduct;

        return [
            'card_product_id' => $this->id,
            'card_label_id' => $cardProduct->cardLabel->id,
            'certificate_number' => $this->certificate_number,
            'grade' => $this->resource->overall_grade,
            'nick_name' => $this->overall_grade_nickname,
            'line_one' => $cardProduct->cardLabel->line_one,
            'line_two' => $cardProduct->cardLabel->line_two,
            'line_three' => $cardProduct->cardLabel->line_three,
            'line_four' => $cardProduct->cardLabel->line_four,
            'card_product' => new CardProductResource($cardProduct),
            'persist_changes' => true,
        ];
    }
}
