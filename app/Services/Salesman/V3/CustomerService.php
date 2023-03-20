<?php

namespace App\Services\Salesman\V3;

use App\Exceptions\API\Salesman\Customer\CustomerDetailsCouldNotBeUpdated;
use App\Models\User;
use App\Services\AGS\AgsService;
use App\Services\Salesman\V2\CustomerService as V2CustomerService;
use Symfony\Component\HttpFoundation\Response;

class CustomerService extends V2CustomerService
{
    public function updateCustomer(User $user, array $data): User
    {
        $agsService = resolve(AgsService::class);

        $response = $agsService->updateUserDataByUsername($user->username, $data);

        if (! empty($response['code'])) {
            throw_if($response['code'] === Response::HTTP_INTERNAL_SERVER_ERROR, CustomerDetailsCouldNotBeUpdated::class);
            throw_if($response['code'] === Response::HTTP_BAD_REQUEST, CustomerDetailsCouldNotBeUpdated::class);
        }

        $user->update($data);

        return $user;
    }
}
