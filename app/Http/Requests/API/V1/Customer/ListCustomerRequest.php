<?php

namespace App\Http\Requests\API\V1\Customer;

use App\Rules\Customer\OrderSubmissionsRule;
use Illuminate\Foundation\Http\FormRequest;

class ListCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'filter.submissions' => ['sometimes', new OrderSubmissionsRule]
        ];
    }
}
