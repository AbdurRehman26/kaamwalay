<?php

namespace App\Services\Admin\Card;

use App\Models\CardSeries;
use Illuminate\Database\Eloquent\Collection;
use Spatie\QueryBuilder\QueryBuilder;

class CardSeriesService
{
    public function search(): Collection
    {
        $query = CardSeries::select('id', 'name', 'card_category_id', 'image_path');

        if (request('category_id')) {
            $query->where('card_category_id', request('category_id'));
        }

        return QueryBuilder::for($query)->get();
    }

    public function create(array $data): CardSeries
    {
        return CardSeries::create([
            'name' => $data['name'],
            'image_path' => $data['image_url'],
            'image_bucket_path' => $data['image_url'],
            'card_category_id' => $data['card_category_id'],
        ]);
    }
}
