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
            ->allowedFilters([
                AllowedFilter::custom('search', new AdminCustomerSearchFilter),
                AllowedFilter::scope('signed_up_between'),
                AllowedFilter::scope('submissions'),
            ])
            ->allowedSorts([
                AllowedSort::field('submissions', 'orders_count'),
                AllowedSort::field('signed_up', 'created_at'),
                AllowedSort::custom('full_name', new AdminCustomerFullNameSort),
                'email', 'customer_number'
            ])
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::PER_PAGE));
    }
}
