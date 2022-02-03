<?php

namespace App\Services\Admin\Card;

use App\Models\CardCategory;
use Illuminate\Database\Eloquent\Collection;
use Spatie\QueryBuilder\QueryBuilder;

class CardCategoryService
{
    public function search(): Collection
    {
        $query = CardCategory::select('id', 'name', 'image_url');

        return QueryBuilder::for($query)->get();
    }
}
