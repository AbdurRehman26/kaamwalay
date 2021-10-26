<?php

namespace App\Http\Resources\API\CardProduct;

use App\Http\Resources\API\BaseResource;

class CardProductResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            "id" => $this->id,
            "long_name" => $this->getLongName(),
            "short_name" => $this->getShortName(),
            "name" => $this->name,
            "card_category_name" => $this->cardCategory->name,
            "card_set_name" => $this->cardSet->name,
            "card_series_name" => $this->cardSet->cardSeries->name,
            "release_date" => $this->formatDate($this->cardSet->release_year),
            "release_year" => $this->cardSet->release_year,
            "card_number_order" => $this->getFormattedCardNumber(),
            "image_path" => $this->image_path,
            "language" => $this->language,
            "variant" => $this->variant,
            "surface" => $this->surface,
            "edition" => $this->edition,
        ];
    }
}
