<?php

namespace App\Services\Admin\Card;

use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Services\AGS\AgsService;
use Carbon\Carbon;

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
        if(array_key_exists('set_id', $data) && $data['set_id']){
            $set = CardSet::find($data['set_id']);
            $createData = array_merge($createData,[
                'release_date'=> $set->release_date,
                'series_id'=> $set->series_id,
                'set_id'=> $set->id,
            ]);

        }
        else{

            if(array_key_exists('series_id', $data) && $data['series_id']){
                $series = CardSeries::find($data['series_id']);
                $createData['series_id'] = $series->id;
            }
            else{
                $series = CardSeries::where('name', 'like' , '%' . $data['series_name'] . '%')->where('card_category_id', $category->id)->first();

                if($series){
                    $createData['series_id'] = $series->id;
                }
                else{
                    $series = new CardSeries([
                        'name' => $data['series_name'],
                        'image_path' => $data['series_image'],
                        'image_bucket_path' => $data['series_image'],
                        'card_category_id' => $category->id,
                    ]);
                    $series->save();

                    $createData = array_merge($createData,[
                        'series_name'=> $data['series_name'],
                        'series_image'=> $data['series_image'],
                    ]);
                }

            }

            $set = CardSet::where('name', 'like' , '%' . $data['set_name'] . '%')->where('card_series_id', $series->id)->first();

            if($set){
                $createData = array_merge($createData,[
                    'release_date'=> $set->release_date,
                    'set_id'=> $set->id,
                ]);
            } else {
                $set = new CardSet([
                    'name' => $data['set_name'],
                    'description' => '',
                    'image_path' => $data['set_image'],
                    'image_bucket_path' => $data['set_image'],
                    'card_category_id' => $category->id,
                    'card_series_id' => $series->id,
                    'release_date' => $data['release_date'],
                    'release_year' => (new Carbon($data['release_date']))->format('Y'),
                ]);
                $set->save();

                $createData = array_merge($createData,[
                    'set_name'=> $data['set_name'],
                    'set_image'=> $data['set_image'],
                    'release_date' => $data['release_date'],
                ]);
            }
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
            'added_by_id' => auth()->user()->id
        ]);
        $card->save();


        $createData = array_merge($createData,[
            'name' => $data['name'],
            'category_id' => $category->id,
            'rarity' => $data['rarity'],
            'card_number' => $data['card_number'],
            'card_number_order' => $data['card_number'],
            'image_path' => $data['image_path'],
            'edition' => $data['edition'] ?? '',
            'surface' => $data['surface'] ?? '',
            'variant' => $data['variant'] ?? '',
            'language' => $data['language'],
        ]);

        \Log::debug($createData);
        // $this->agsService->createCard($createData);

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
