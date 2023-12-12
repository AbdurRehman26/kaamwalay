<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class CustomerService
{
    protected const PER_PAGE = 20;

    // @phpstan-ignore-next-line
    public function getCustomers(): LengthAwarePaginator
    {
        return QueryBuilder::for(User::customer())
            ->allowedFilters(User::getAllowedCustomerFilters())
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::PER_PAGE));
    }
}
