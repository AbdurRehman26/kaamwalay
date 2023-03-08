<?php

namespace App\Http\Filters;

use App\Models\CardRarity;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminCardRaritySearchFilter implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        $query->whereLike(
            [
                'name',
            ],
            $value
        );
    }
}
