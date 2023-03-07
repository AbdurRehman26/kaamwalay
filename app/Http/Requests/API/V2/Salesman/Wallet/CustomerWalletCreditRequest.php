<?php

namespace App\Http\Requests\API\V2\Salesman\Wallet;

use Illuminate\Foundation\Http\FormRequest;

class CustomerWalletCreditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user()->isSalesman();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric'],
        ];
    }
}
