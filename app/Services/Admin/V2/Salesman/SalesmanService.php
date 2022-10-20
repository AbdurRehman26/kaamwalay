<?php

namespace App\Services\Admin\V2\Salesman;

use App\Models\User;
use App\Services\EmailService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\Password;

class SalesmanService
{
    protected const PER_PAGE = 20;

    public function __construct(protected EmailService $emailService)
    {
        //
    }

    public function getSalesmen(): LengthAwarePaginator
    {
        return QueryBuilder::for(User::salesmen())
            ->allowedFilters(User::getAllowedAdminSalesmanFilters())
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::PER_PAGE));
    }

    public function createSalesman(array $data): User
    {
        $salesman = User::createSalesman($data);
        dd($salesman);
        $this->sendAccessEmailToCreatedUser($salesman);

        return $salesman;
    }

    public function sendAccessEmailToCreatedUser(User $user): void
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
