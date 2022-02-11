<?php

namespace App\Services\Admin\Card;

use App\Exceptions\API\Admin\CardDataIsMissing;
use App\Exceptions\API\Admin\CardProductCanNotBeCreated;
use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Models\CardRarity;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Services\AGS\AgsService;
use Exception;
use Stripe\Card;

class CardProductService
{
    public const CARD_RARITIES = [
        'Common',
        'Uncommon',
        'Rare',
    ];

    public const YUGIOH_CARD_RARITIES = [
        'Common',
        'Rare',
        'Super Rare',
        'Ultra Rare',
        'Secret Rare',
        'Ultimate Rare',
        'Ghost Rare',
        'Prismatic Secret Rare',
        'Starlight Rare',
        'Gold Rare',
        'Platinum Rare',
        'Parallel Rare',
        'Super Parallel Rare',
        'Ultra Parallel Rare',
        'Secret Parallel Rare',
        'Duel Terminal',
        'Starfoil Rare',
        'Mosaic Rare',
        'Shatterfoil Rare',
        'Gold Secret Rare',
        'Platinum Secret Rare',
        'Pharaoh Ultra Rare',
        'Pharaoh Secret Rare',
        'Collector\'s Rare',
        'Premium Gold Rare',
    ];

    public const CARD_EDITIONS = [
        '1st Edition',
        'Shadowless',
        'Unlimited',
    ];

    public const CARD_SURFACES = [
        'Holo',
        'Cracked Ice Holo',
        'Cosmos Holo',
        'Reverse Holo',
        'Reverse Foil',
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

    protected function getSeriesFromAgs(string $seriesName, string $seriesImage, array $data): int | null
    {
        return $this->agsService->getCardSeries(['name' => $seriesName])['results'][0]['id'];
    }

    protected function getSetFromAgs(int $seriesId, string $setName, string $setImage, array $data): int | null
    {
        return $this->agsService->getCardSet([
            'name' => $setName,
            'serie' => $seriesId,
        ])['results'][0]['id'];
    }

    protected function processAgsCreate(int $categoryId, string $seriesName, string $seriesImage, string $setName, string $setImage, array $data): array
    {
        try {
            $createData['series_id'] = $this->getSeriesFromAgs($seriesName, $seriesImage, $data);
            $createData['set_id'] = $this->getSetFromAgs($createData['series_id'], $setName, $setImage, $data);

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

    public function create(array $data): CardProduct
    {
        $category = CardCategory::find($data['category']);

        $series = CardSeries::find($data['series_id']);
        $seriesName = $series->name;
        $seriesImage = $series->image_path;

        $set = CardSet::find($data['set_id']);
        $setName = $set->name;
        $setImage = $set->image_path;

        if (! isset($seriesName) || ! isset($setName) || ! isset($seriesImage) || ! isset($setImage)) {
            throw new CardDataIsMissing;
        }

        //store in AGS
        $agsResponse = $this->processAgsCreate($category->id, $seriesName, $seriesImage, $setName, $setImage, $data);

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
            'card_reference_id' => '',
//            'card_reference_id' => $agsResponse['card_reference_id'],
        ]);
        $card->save();

        return $card;
    }

    public function getOptionsValues(CardCategory $cardCategory): array
    {
        return [
            'rarity' => CardRarity::where('card_category_id', $cardCategory->id)->select('name')->pluck('name')->toArray(),
            'edition' => CardProductService::CARD_EDITIONS,
            'surface' => CardProductService::CARD_SURFACES,
            'language' => CardProductService::CARD_LANGUAGES,
        ];
    }
}
