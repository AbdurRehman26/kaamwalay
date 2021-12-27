<?php

namespace App\Services\Admin;

use App\Http\Filters\AdminCustomerSearchFilter;
use App\Http\Sorts\AdminCustomerFullNameSort;
use App\Http\Sorts\FullNameSort;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class CustomerService
{
    private const PER_PAGE = 20;

    public function getCustomers(): LengthAwarePaginator
    {
        return QueryBuilder::for(User::withCount('orders')->customer())
            ->allowedFilters(User::getAllowedAdminFilters())
            ->allowedSorts(User::getAllowedAdminSorts())
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::PER_PAGE));
    }
}
