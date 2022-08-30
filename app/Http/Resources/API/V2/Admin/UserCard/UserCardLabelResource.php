<?php

namespace App\Http\Resources\API\V2\Admin\UserCard;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Admin\CardLabel\CardLabelResource;
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
            'id' => $this->id,
            'certificate_number' => $this->certificate_number,
            'grade' => $this->resource->overall_grade,
            'nickname' => $this->overall_grade_nickname,
            'card_label' => new CardLabelResource($cardProduct->cardLabel),
        ];

    }
}
