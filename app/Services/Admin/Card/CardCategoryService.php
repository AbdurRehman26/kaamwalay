<?php

namespace App\Services\Admin\Card;

use App\Models\CardCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;

class CardCategoryService
{
    /**
     * @return Collection<int, Model>
     */
    public function search(): Collection
    {
        $query = CardCategory::select('id', 'name', 'image_url');

        return QueryBuilder::for($query)->get();
    }
}
