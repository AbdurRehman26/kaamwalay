<?php

namespace App\Services\Admin\Card;

use App\Exceptions\API\Admin\CardCategoryCanNotBeCreated;
use App\Models\CardCategory;
use App\Services\AGS\AgsService;

class CardCategoryService
{
    public function __construct(protected AgsService $agsService)
    {
    }

    public function create(array $data): CardCategory
    {
        $response = $this->createCategoryOnAgs($data['name']);
        if(! empty($response)) {
            return CardCategory::create([
                'name' => $data['name'],
                'card_category_type_id' => $data['card_category_type_id'],
                'image_url' => $data['image_url'],
            ]);
        }

        throw new CardCategoryCanNotBeCreated;
    }

    protected function createCategoryOnAgs(string $categoryName): array
    {
        return $this->agsService->createCardCategory($categoryName);
    }
}
