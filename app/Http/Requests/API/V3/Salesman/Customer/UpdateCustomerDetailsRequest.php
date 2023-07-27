<?php

namespace App\Http\Requests\API\V3\Salesman\Customer;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerDetailsRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User $user */
        $user = $this->route('user');

        return $user->salesman()->exists() && $user->salesman()->is(auth()->user());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'phone' => ['nullable', 'string'],
        ];
    }
}
