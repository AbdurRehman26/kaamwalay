<?php

namespace App\Http\Requests\API\V1\Admin\Customer;

use App\Rules\Customer\DateBetweenRule;
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
            'filter.signed_up_between' => ['sometimes', new DateBetweenRule],
            'filter.submissions' => ['sometimes', function ($attribute, $value, $fail) {
                return $this->validateSubmissionFilter($value) ??
                        $fail('Both Min. and Max. fields of submission are required.');
            },
            ],
        ];
    }

    protected function validateSubmissionFilter(string|null $value): bool
    {
        if (is_null($value) ||
            (
                str_contains($value, ',') &&
                count(explode(',', $value)) === 2
            )) {
            return true;
        }

        return false;
    }
}
