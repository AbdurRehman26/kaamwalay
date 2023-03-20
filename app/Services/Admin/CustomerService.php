<?php

namespace App\Services\Admin;

use App\Exceptions\API\Admin\Customer\CustomerDetailsCouldNotBeUpdated;
use App\Models\User;
use App\Services\AGS\AgsService;
use App\Services\EmailService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\QueryBuilder;
use Symfony\Component\HttpFoundation\Response;

class CustomerService
{
    protected const PER_PAGE = 20;

    public function __construct(protected EmailService $emailService, protected AgsService $agsService)
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
            ->with(['salesman', 'referrer', 'referredBy'])
            ->paginate(request('per_page', self::PER_PAGE));
    }

    public function createCustomer(array $data): User
    {
        $data['password'] = Str::random(8);
        $data['created_by'] = auth()->user()->id;

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

    public function updateCustomer(User $user, array $data): User
    {

        $response = $this->agsService->updateUserDataByUsername($user->username, $data);

        if (! empty($response['code'])) {
            throw_if($response['code'] === Response::HTTP_INTERNAL_SERVER_ERROR, CustomerDetailsCouldNotBeUpdated::class);
            throw_if($response['code'] === Response::HTTP_BAD_REQUEST, CustomerDetailsCouldNotBeUpdated::class);
        }

        $user->update($data);

        return $user;
    }
}
