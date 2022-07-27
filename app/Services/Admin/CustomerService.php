<?php

namespace App\Services\Admin;

use App\Events\API\Admin\Customer\CustomerCreated;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\QueryBuilder;

class CustomerService
{
    protected const PER_PAGE = 20;

    public function getCustomers(): LengthAwarePaginator
    {
        return QueryBuilder::for(User::customer())
            ->allowedFilters(User::getAllowedAdminFilters())
            ->allowedSorts(User::getAllowedAdminSorts())
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::PER_PAGE));
    }

    public function createCustomer(array $data): User
    {
        $data['password'] = Hash::make(Str::random(8));

        $user = User::createCustomer($data);

        CustomerCreated::dispatch($user);

        return $user;
    }
}
