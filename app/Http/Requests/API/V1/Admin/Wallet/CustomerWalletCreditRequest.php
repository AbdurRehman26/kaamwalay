<?php

namespace App\Http\Requests\API\V1\Admin\Wallet;

use Illuminate\Foundation\Http\FormRequest;

class CustomerWalletCreditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric'],
        ];
    }
}
