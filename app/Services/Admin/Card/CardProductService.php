<?php

namespace App\Services\Admin\Card;

use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CardProductService
{
    public function __construct()
    {
    }

    public function create(array $data): CardProduct
    {
        Log::debug($data);

        $category = CardCategory::firstOrCreate([
            'name' => $data['category']
        ]);

        $series = CardSeries::where('name', $data['series'])->where('card_category_id', $category->id)->first();

        if(!$series){
            $series = new CardSeries([
                'name' => $data['series'],
                'image_path' => '',
                'image_bucket_path' => '',
                'card_category_id' => $category->id,
            ]);
            $series->save();
        }


        $set = CardSet::where('name', $data['set'])->where('card_series_id', $series->id)->first();

        if(!$set){
            $set = new CardSet([
                'name' => $data['set'],
                'description' => '',
                'image_path' => '',
                'image_bucket_path' => '',
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
            'added_by_id' => auth()->user()->id
        ]);
        $card->save();

        return $card;
    }
}
