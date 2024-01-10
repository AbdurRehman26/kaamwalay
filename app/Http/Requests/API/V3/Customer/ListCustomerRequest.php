<?php

namespace App\Http\Requests\API\V3\Customer;

use Illuminate\Foundation\Http\FormRequest;

class ListCustomerRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'filter.search' => ['required'],
        ];
    }
}
