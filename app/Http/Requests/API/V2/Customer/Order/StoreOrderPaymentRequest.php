<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderPaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        /** @var Order $order */
        $order = $this->route('order');

        return $order->user->is($this->user());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'payment_method' => [
                Rule::requiredIf(empty($this->input('payment_by_wallet'))),
                'nullable',
                'array',
            ],
            'payment_method.id' => [
                Rule::requiredIf(empty($this->input('payment_by_wallet'))),
                'integer',
                'exists:payment_methods,id',
            ],
            'payment_by_wallet' => [
                Rule::requiredIf(empty($this->payment_method)),
                'numeric',
            ],
            'payment_provider_reference' => ['nullable', 'array'],
            'payment_provider_reference.id' => ['nullable', 'string'],
            'coupon.code' => ['sometimes', 'exists:coupons,code'],
            'payment_plan.id' => ['sometimes', 'exists:payment_plans,id'],
        ];
    }
}
