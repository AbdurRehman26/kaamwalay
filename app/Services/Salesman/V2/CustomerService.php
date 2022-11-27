<?php

namespace App\Services\Salesman\V2;

use App\Models\User;
use App\Services\EmailService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\QueryBuilder;

class CustomerService
{
    protected const PER_PAGE = 20;

    public function __construct(protected EmailService $emailService)
    {
        //
    }

    // @phpstan-ignore-next-line
    public function getCustomers(): LengthAwarePaginator
    {
        return QueryBuilder::for(User::customer())
            ->allowedFilters(User::getAllowedAdminFilters())
            ->allowedSorts(User::getAllowedAdminSorts())
            ->defaultSort('-created_at')
            ->with('salesman')
            ->paginate(request('per_page', self::PER_PAGE));
    }

    public function createCustomer(array $data): User
    {
        $data['password'] = Str::random(8);
        $data['created_by'] = auth()->user()->id;
        $data['salesman_id'] = auth()->user()->id;

        $user = User::createCustomer($data);

        $this->sendAccessEmailToCreatedCustomer($user);

        return $user;
    }

    public function sendAccessEmailToCreatedCustomer(User $user): void
    {
        $token = Password::broker()->createToken($user);

        $this->emailService->sendEmail(
            [[$user->email => $user->first_name ?? '']],
            EmailService::SUBJECT[EmailService::TEMPLATE_CREATED_USER_ACCESS_ACCOUNT],
            EmailService::TEMPLATE_CREATED_USER_ACCESS_ACCOUNT,
            ['ACCESS_URL' => config('app.url') . '/auth/password/create?token='.$token.'&name='.$user->first_name.'&email='.urlencode($user->email)],
        );
    }
}
