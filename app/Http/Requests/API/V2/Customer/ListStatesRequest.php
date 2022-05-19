<?php

namespace App\Http\Requests\API\V2\Customer;

use Illuminate\Foundation\Http\FormRequest;

class ListStatesRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'country_code' => ['sometimes', 'nullable', 'exists:countries,code'],
        ];
    }
}
