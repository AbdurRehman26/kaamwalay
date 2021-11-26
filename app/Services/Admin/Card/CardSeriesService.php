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
}
