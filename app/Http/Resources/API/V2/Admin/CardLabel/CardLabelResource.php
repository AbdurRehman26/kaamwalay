<?php

namespace App\Http\Resources\API\V2\Admin\CardLabel;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\CardProduct\CardProductResource;
use App\Models\CardLabel;
use Illuminate\Http\Request;

/**
 * @mixin CardLabel
 */
class CardLabelResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'card_label_id' => $this->id,
            'line_one' => $this->line_one,
            'line_two' => $this->line_two,
            'line_three' => $this->line_three,
            'line_four' => $this->line_four,
            'card_product' => new CardProductResource($this->cardProduct),
        ];
    }
}
