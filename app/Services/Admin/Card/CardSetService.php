<?php

namespace App\Services\Admin\Card;

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
}
