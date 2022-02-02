<?php

namespace App\Services\Admin\Card;

use App\Models\CardSeries;
use App\Models\CardSet;
use Illuminate\Database\Eloquent\Collection;
use Spatie\QueryBuilder\QueryBuilder;

class CardSetService
{
    public function search(): Collection
    {
        $query = CardSet::select('id', 'name', 'card_series_id', 'release_date', 'image_path');

        if (request('series_id')) {
            $query->where('card_series_id', request('series_id'));
        }

        return QueryBuilder::for($query)->get();
    }

    public function create(array $data): CardSet
    {
        return CardSet::create([
            'name' => $data['name'],
            'image_path' => $data['image_url'],
            'image_bucket_path' => $data['image_url'],
            'card_category_id' => CardSeries::find($data['card_series_id'])->card_category_id,
            'card_series_id' => $data['card_series_id'],
            'release_date' => $data['release_date'],
            'description' => $data['description'] ?? '',
        ]);
    }
}
