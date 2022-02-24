<?php

namespace App\Services\Admin\Card;

use App\Events\API\Admin\Card\CardProductCreatedEvent;
use App\Exceptions\API\Admin\CardProductCanNotBeCreated;
use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Models\CardRarity;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\CardSurface;
use App\Services\AGS\AgsService;
use Exception;

class CardProductService
{
    public const CARD_EDITIONS = [
        '1st Edition',
        'Shadowless',
        'Unlimited',
    ];

    public const CARD_LANGUAGES = [
        'Japanese',
        'English',
        'Dutch',
        'German',
        'French',
        'Italian',
        'Spanish',
        'Portuguese',
        '(South) Korean',
        'Traditional Chinese',
        'Russian',
        'Polish',
    ];

    public function __construct(protected AgsService $agsService)
    {
    }

    public function create(array $data): CardProduct
    {
        $category = CardCategory::find($data['category']);

        $seriesName = CardSeries::find($data['series_id'])->name;

        $set = CardSet::find($data['set_id']);

        //store in AGS
        $agsResponse = $this->createCardProductOnAgs($category->id, $seriesName, $set->name, $data);

        if (! $agsResponse || ! array_key_exists('id', $agsResponse)) {
            throw new CardProductCanNotBeCreated;
        }

        $card = new CardProduct([
            'name' => $data['name'],
            'card_set_id' => $set->id,
            'card_category_id' => $category->id,
            'rarity' => $data['rarity'],
            'card_number' => $data['card_number'],
            'card_number_order' => $data['card_number'],
            'image_path' => $data['image_path'],
            'edition' => $data['edition'] ?? 'Unlimited',
            'surface' => $data['surface'] ?? '',
            'variant' => $data['variant'] ?? '',
            'language' => $data['language'],
            'added_manually' => true,
            'added_by' => auth()->user()->id,
            'card_reference_id' => $agsResponse['card_reference_id'],
        ]);
        $card->save();

        CardProductCreatedEvent::dispatch($card);

        return $card;
    }

    public function getOptionsValues(CardCategory $cardCategory): array
    {
        return [
            'rarity' => CardRarity::where('card_category_id', $cardCategory->id)->pluck('name')->toArray(),
            'edition' => CardProductService::CARD_EDITIONS,
            'surface' => CardSurface::where('card_category_id', $cardCategory->id)->pluck('name')->toArray(),
            'language' => CardProductService::CARD_LANGUAGES,
        ];
    }

    protected function createCardProductOnAgs(int $categoryId, string $seriesName, string $setName, array $data): array
    {
        try {
            $createData['series_id'] = $this->getSeriesFromAgs($seriesName);
            $createData['set_id'] = $this->getSetFromAgs($createData['series_id'], $setName);

            $createData = array_merge($createData, [
                'name' => $data['name'],
                'category_id' => $categoryId,
                'rarity' => $data['rarity'],
                'card_number_order' => $data['card_number'],
                'image_path' => $data['image_path'],
                'edition' => $data['edition'] ?? 'Unlimited',
                'surface' => $data['surface'] ?? '',
                'variant' => $data['variant'] ?? '',
                'language' => $data['language'],
            ]);

            return $this->agsService->createCard($createData);
        } catch (Exception $e) {
            report($e);

            return [];
        }
    }

    protected function getSeriesFromAgs(string $seriesName): int | null
    {
        return $this->agsService->getCardSeries(['name' => $seriesName])['results'][0]['id'];
    }

    protected function getSetFromAgs(int $seriesId, string $setName): int | null
    {
        return $this->agsService->getCardSet([
            'name' => $setName,
            'serie' => $seriesId,
        ])['results'][0]['id'];
    }
}
