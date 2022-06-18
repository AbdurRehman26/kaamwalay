<?php

namespace App\Services;

use App\Models\CustomerAddress;
use Exception;

class CustomerAddressService {

    public function create(array $data) : void {
        CustomerAddress::create(array_merge(
            $data,
            [
                'user_id' => auth()->user()->id,
            ]
        ));
    }

    public function update(CustomerAddress $customerAddress, array $data) : void {
        try {
            $update = $customerAddress->update($data);
            //dd($update);
        } catch (Exception $e) {
            print_r($e->getMessage());
        }
    }
}