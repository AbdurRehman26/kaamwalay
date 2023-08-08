<?php

namespace App\Services;

use App\Models\CustomerAddress;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CustomerAddressService
{
    public function create(array $data): CustomerAddress
    {
        return CustomerAddress::create(array_merge(
            $data,
            [
                'user_id' => auth()->user()->id,
            ]
        ));
    }

    public function update(CustomerAddress $customerAddress, array $data): CustomerAddress|JsonResponse
    {
        try {
            $customerAddress->update($data);

            return $customerAddress;
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
