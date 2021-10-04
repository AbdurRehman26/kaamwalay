<?php

namespace App\Http\Resources\API\CardProduct;

use App\Http\Resources\API\BaseResource;

class CardProductResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            "id" => $this->id,
            "full_name" => $this->getSearchableName(),
            "name" => $this->name,
            "card_category_name" => $this->cardCategory->name,
            "card_set_name" => $this->cardSet->name,
            "card_series_name" => $this->cardSet->cardSeries->name,
            "release_date" => $this->formatDate($this->cardSet->release_year),
            "release_year" => $this->cardSet->release_year,
            "card_number_order" => is_numeric($this->card_number_order) ? \Str::padLeft($this->card_number_order, 3, '0') : $this->card_number_order,
            "image_path" => $this->image_path,
        ];
    }
}
