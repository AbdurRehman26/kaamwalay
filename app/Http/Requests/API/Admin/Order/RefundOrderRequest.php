<?php

namespace App\Http\Requests\API\Admin\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'amount' => [
                'required',
                'numeric',
                Rule::exists(
                    'order_payments',
                    function ($query) {
                        $query->where('id', $this->route('orderPayment')->id)
                            ->where('amount', '<=', $this->get('amount'));
                    }
                ),
            ],
            'notes' => ['required'],
        ];
    }
}
