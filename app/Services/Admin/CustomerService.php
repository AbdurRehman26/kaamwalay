<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CustomerService
{
    private const PER_PAGE = 20;

    public function getCustomers(): LengthAwarePaginator
    {
        return QueryBuilder::for(User::withCount('orders')->customer())
            ->allowedFilters([
                AllowedFilter::scope('signed_up_between'),
                AllowedFilter::scope('submissions'),
            ])
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::PER_PAGE));
    }
}
