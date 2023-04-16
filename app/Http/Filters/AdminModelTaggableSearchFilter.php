<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class AdminModelTaggableSearchFilter implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        if(gettype($value) === 'string'){
            if($value == -1){
                $query->doesntHave('tags');
            }else{
                $query->withAllTags([$value]);
            }
        }else{
            $query->withAllTags($value);
        }
    }
}
