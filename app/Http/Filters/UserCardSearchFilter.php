<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class UserCardSearchFilter implements Filter
{
    public function __invoke(Builder $query, $value, string $property)
    {
        $query->where(function (Builder $query) use ($value) {
            $query->where('certificate_number', 'like', "%$value%")
                ->orWhereHas(
                    'orderItem.cardProduct',
                    function ($query) use ($value) {
                        $query->where('name', 'like', "%$value%")
                            ->orWhere('card_number_order', 'like', "%$value%")
                            ->orWhereHas(
                                'cardSet',
                                function ($query) use ($value) {
                                    $query->where('name', 'like', "%$value%")
                                        ->orWhere('release_year', 'like', "%$value%")
                                        ->orWhereHas(
                                            'cardSeries',
                                            function ($query) use ($value) {
                                                $query->where('name', 'like', "%$value%");
                                            }
                                        );
                                }
                            )
                            ->orWhereHas(
                                'cardCategory',
                                function ($query) use ($value) {
                                    $query->where('name', 'like', "%$value%");
                                }
                            );;
                    }
                )
                ->orWhereHas(
                    'orderItem.order',
                    function ($query) use ($value) {
                        $query->where('order_number', 'like', "%$value%");
                    }
                );
        });
    }
}
