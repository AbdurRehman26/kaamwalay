<?php

namespace App\Services\Admin\Card;

use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Services\AGS\AgsService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

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

    public const CARD_CATEGORY_CODES = [
        'Pokemon' => 'PKM',
    ];

    public function __construct(protected AgsService $agsService)
    {
    }

    public function create(array $data): CardProduct
    {
        $category = CardCategory::find($data['category']);

        $createData = [];
        $seriesName = '';
        if (array_key_exists('series_id', $data) && $data['series_id']) {
            $series = CardSeries::find($data['series_id']);
            $seriesName = $series->name;

            $seriesResponse = $this->agsService->getSeries(['name' => $seriesName]);

            if ($seriesResponse["count"] > 0) {

                $createData['series_id'] = $seriesResponse['results'][0]['id'];
            }

        } else if (array_key_exists('series_name', $data) && $data['series_name']) {
            $seriesName = $data['series_name'];
        }

        if (!array_key_exists('series_id', $createData)) {

            $seriesResponse = $this->agsService->getSeries(['name' => $seriesName]);

            if ($seriesResponse["count"] > 0) {

                $createData['series_id'] = $seriesResponse['results'][0]['id'];
            } else if ( $seriesName && $data['series_image'] ) {
                $createSeriesResponse = $this->agsService->createSeries(['name' => $seriesName, 'image_path' => $data['series_image']]);

                if ( array_key_exists('id', $createSeriesResponse) )
                {
                    $createData['series_id'] = $seriesResponse['id'];
                }
            }

            $series = new CardSeries([
                'name' => $seriesName,
                'image_path' => $data['series_image'],
                'image_bucket_path' => $data['series_image'],
                'card_category_id' => $category->id,
            ]);
            $series->save();
        }

        $setName = '';
        if (array_key_exists('set_id', $data) && $data['set_id']) {
            $set = CardSet::find($data['set_id']);
            $setName = $set->name;

            $setResponse = $this->agsService->getSet([
                'name' => $setName,
                'serie' => $createData['series_id']
            ]);

            if ($setResponse["count"] > 0) {
                $createData['set_id'] = $setResponse['results'][0]['id'];
            }

        } else if (array_key_exists('set_name', $data) && $data['set_name']) {
            $setName = $data['set_name'];
        }

        if (!array_key_exists('set_id', $createData)) {

            $setResponse = $this->agsService->getSet(['name' => $setName, 'serie' => $createData['series_id']]);

            if ($setResponse["count"] > 0) {

                $createData['set_id'] = $setResponse['results'][0]['id'];
            } else if ( $setName && $createData['series_id'] && $data['release_date'] && $data['set_image']) {
                $createSetResponse = $this->agsService->createSet([
                    'name' => $setName,
                    'image_path' => $data['set_image'],
                    'release_date' => $data['release_date'],
                    'serie_id' => $createData['series_id']
                ]);

                if ( array_key_exists('id', $createSetResponse) )
                {
                    $createData['set_id'] = $createSetResponse['id'];
                }
            }

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

        $createData = array_merge($createData,[
            'name' => $data['name'],
            'category_id' => $category->id,
            'rarity' => $data['rarity'],
            'card_number_order' => $data['card_number'],
            'image_path' => $data['image_path'],
            'edition' => $data['edition'] ?? '',
            'surface' => $data['surface'] ?? '',
            'variant' => $data['variant'] ?? '',
            'language' => $data['language'],
        ]);
        Log::debug($createData);
        $this->agsService->createCard($createData);

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
            'added_by_id' => auth()->user()->id
        ]);
        $card->save();

        return $card;
    }

    public function getOptionsValues()
    {
        return [
            'category' => CardCategory::select('id','name')->get(),
            'rarity' => CardProductService::CARD_RARITIES,
            'edition' => CardProductService::CARD_EDITIONS,
            'surface' => CardProductService::CARD_SURFACES,
            'language' => CardProductService::CARD_LANGUAGES,
            'series' => CardSeries::with('cardSets:id,card_series_id,name,image_path,release_date')
                        ->select('id','name','image_path')->get(),
        ];
    }

}
