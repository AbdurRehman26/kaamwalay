<?php

namespace App\Services\Admin\Card;

use App\Models\CardCategory;
use App\Services\AGS\AgsService;

class CardCategoryService 
{
    public function __construct(protected AgsService $agsService)
    {
    }

    public function create(array $data): CardCategory {
        $this->createCategoryOnAgs($data['name']);

        return CardCategory::create([
            'name' => $data['name'],
            'image_url' => $data['image_url']
        ]);
    }

    protected function createCategoryOnAgs(string $categoryName): array
    {
        return $this->agsService->createCardCategory($categoryName);
    }
}
