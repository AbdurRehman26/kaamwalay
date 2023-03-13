<?php

namespace App\Http\Requests\API\V2\Admin\Order;

use App\Rules\V2\Order\RefundAmountRule;
use Illuminate\Foundation\Http\FormRequest;

class RefundOrderRequest extends FormRequest
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
            'notes' => ['required'],
            'add_to_wallet' => ['required', 'boolean'],
            'amount' => [
                'required',
                'numeric',
                new RefundAmountRule,
            ],
        ];
    }
}
