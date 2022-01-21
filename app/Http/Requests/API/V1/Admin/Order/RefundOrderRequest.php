<?php

namespace App\Http\Requests\API\V1\Admin\Order;

use App\Rules\Order\RefundAmountRule;
use Illuminate\Foundation\Http\FormRequest;

class RefundOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
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
