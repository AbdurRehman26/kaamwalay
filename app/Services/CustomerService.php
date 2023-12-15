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
        $query = User::customer();

        if (! empty(request('filter')['email_or_customer_number'])) {
            $emailOrCustomerNumber = request('filter')['email_or_customer_number'];

            $query->where('email', '=', $emailOrCustomerNumber)
                ->orWhere('customer_number', '=', $emailOrCustomerNumber);
        }

        return QueryBuilder::for($query)
            ->paginate(request('per_page', self::PER_PAGE));
    }
}
