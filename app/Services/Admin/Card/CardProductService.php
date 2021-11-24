<?php

namespace App\Services\Admin\Card;

use App\Exceptions\API\Admin\CardProductCanNotBeCreated;
use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Services\AGS\AgsService;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use TypeError;

class CardProductService
{
    public const CARD_RARITIES = [
        'Common',
        'Uncommon',
        'Rare',
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

    protected function getReferenceId(array $data): string | null
    {
        return null;
    }

    protected function getOrCreateSeriesFromAgs(string $seriesName, array $data): int
    {
        $seriesId = 0;

        //Store in AGS
        $seriesResponse = $this->agsService->getSeries(['name' => $seriesName]);

        if ($seriesResponse['count'] > 0) {
            $seriesId = $seriesResponse['results'][0]['id'];
        } elseif ($seriesName && $data['series_image']) {
            $createSeriesResponse = $this->agsService->createSeries(['name' => $seriesName, 'image_path' => $data['series_image']]);

            if (array_key_exists('id', $createSeriesResponse)) {
                $seriesId = $seriesResponse['id'];
            }
        }

        return $seriesId;
    }

    protected function getOrCreateSetFromAgs(int $seriesId, string $setName, array $data): int
    {
        $setId = 0;

        //Store in AGS
        $setResponse = $this->agsService->getSet([
            'name' => $setName,
            'serie' => $seriesId,
        ]);

        if ($setResponse['count'] > 0) {
            $setId = $setResponse['results'][0]['id'];
        } elseif ($setName && $seriesId && $data['release_date'] && $data['set_image']) {
            $createSetResponse = $this->agsService->createSet([
                'name' => $setName,
                'image_path' => $data['set_image'],
                'release_date' => $data['release_date'],
                'serie_id' => $seriesId,
            ]);

            if (array_key_exists('id', $createSetResponse)) {
                $setId = $createSetResponse['id'];
            }
        }

        return $setId;
    }

    protected function processAgsCreate(int $categoryId, string $seriesName, string $setName, array $data): array
    {
        try {
            $createData = [];
            $createData['series_id'] = $this->getOrCreateSeriesFromAgs($seriesName, $data);
            $createData['set_id'] = $this->getOrCreateSetFromAgs($createData['series_id'], $setName, $data);

            $cardReferenceId = $this->getReferenceId([
                'series_id' => $createData['series_id'],
                'set_id' => $createData['set_id'],
                'name' => $data['name'],
                'category_id' => $data['category'],
                'release_date' => $data['release_date'],
                'card_number' => $data['card_number'],
                'language' => $data['language'],
                'rarity' => $data['rarity'],
                'edition' => $data['edition'],
                'surface' => $data['surface'],
                'variant' => $data['variant'],
            ]);

            if ($cardReferenceId) {
                $createData['card_reference_id'] = $cardReferenceId;
            }

            $createData = array_merge($createData, [
                'name' => $data['name'],
                'category_id' => $categoryId,
                'rarity' => $data['rarity'],
                'card_number_order' => $data['card_number'],
                'image_path' => $data['image_path'],
                'edition' => $data['edition'] ?? '',
                'surface' => $data['surface'] ?? '',
                'variant' => $data['variant'] ?? '',
                'language' => $data['language'],
            ]);

            return $this->agsService->createCard($createData);
        } catch (Exception $e) {
            return [];
        } catch (TypeError $te) {
            return [];
        }
    }

    public function create(array $data): CardProduct
    {
        $category = CardCategory::find($data['category']);

        $seriesName = '';
        $setName = '';
        $series = null;
        $set = null;
        if (array_key_exists('series_id', $data) && $data['series_id']) {
            $series = CardSeries::find($data['series_id']);
            $seriesName = $series->name;
        } elseif (array_key_exists('series_name', $data) && $data['series_name']) {
            $seriesName = $data['series_name'];
        }

        if (array_key_exists('set_id', $data) && $data['set_id']) {
            $set = CardSet::find($data['set_id']);
            $setName = $set->name;
        } elseif (array_key_exists('set_name', $data) && $data['set_name']) {
            $setName = $data['set_name'];
        }

        //store in AGS
        $agsResponse = $this->processAgsCreate($category->id, $seriesName, $setName, $data);

        if (!$agsResponse || !array_key_exists('id', $agsResponse)) {
            throw new CardProductCanNotBeCreated;
        }

        // Store in RG
        if (! $series) {
            $series = new CardSeries([
                'name' => $seriesName,
                'image_path' => $data['series_image'],
                'image_bucket_path' => $data['series_image'],
                'card_category_id' => $category->id,
            ]);
            $series->save();
        }

        if (! $set) {
            $set = new CardSet([
                'name' => $setName,
                'description' => '',
                'image_path' => $data['set_image'],
                'image_bucket_path' => $data['set_image'],
                'card_category_id' => $category->id,
                'card_series_id' => $series->id,
                'release_date' => $data['release_date'],
                'release_year' => (new Carbon($data['release_date']))->format('Y'),
            ]);
            $set->save();
        }

        $card = new CardProduct([
            'name' => $data['name'],
            'card_set_id' => $set->id,
            'card_category_id' => $category->id,
            'rarity' => $data['rarity'],
            'card_number' => $data['card_number'],
            'card_number_order' => $data['card_number'],
            'image_path' => $data['image_path'],
            'edition' => $data['edition'] ?? '',
            'surface' => $data['surface'] ?? '',
            'variant' => $data['variant'] ?? '',
            'language' => $data['language'],
            'added_manually' => true,
            'added_by_id' => auth()->user()->id,
            'card_reference_id' => $agsResponse['card_reference_id'],
        ]);
        $card->save();

        return $card;
    }

    public function getOptionsValues(): array
    {
        return [
            'category' => CardCategory::select('id', 'name')->get(),
            'rarity' => CardProductService::CARD_RARITIES,
            'edition' => CardProductService::CARD_EDITIONS,
            'surface' => CardProductService::CARD_SURFACES,
            'language' => CardProductService::CARD_LANGUAGES,
            'series' => CardSeries::with('cardSets:id,card_series_id,name,image_path,release_date')
                        ->select('id', 'name', 'image_path')->get(),
        ];
    }
}
