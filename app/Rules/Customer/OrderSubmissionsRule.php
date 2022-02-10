<?php

namespace App\Rules\Customer;

use Illuminate\Contracts\Validation\Rule;

class OrderSubmissionsRule implements Rule
{
    protected array $data = [];

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     */
    public function passes($attribute, $value): bool
    {
        if (
            is_null($value) ||
            (
                str_contains($value, ',') &&
                count(explode(',', $value)) > 1
            )
        ) {
            return true;
        }

        return false;
    }

    public function message(): string
    {
        return 'Both Min. and Max. fields of submission are required.';
    }
}
