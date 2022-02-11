<?php

namespace App\Rules\Customer;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\Rule;

class CreatedAtBetweenRule implements Rule
{
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
                count(explode(',', $value)) > 1 &&
                $this->validDates(explode(',', $value))
            )
        ) {
            return true;
        }

        return false;
    }

    public function message(): string
    {
        return 'Both start date and end date must be valid dates.';
    }

    protected function validDates(array $dates)
    {
        foreach ($dates as $date){
            try {
                Carbon::parse($date);
            } catch (\Exception $e) {
                return false;
            }
        }

        return true;
    }
}
