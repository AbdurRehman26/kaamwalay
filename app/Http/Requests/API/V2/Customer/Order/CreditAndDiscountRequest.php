<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreditAndDiscountRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Order $order */
        $order = $this->route('order');

        return $order->isPayable();
    }

    public function rules(): array
    {
        $sameAsShippingIsFalse = empty($this->{'billing_address.same_as_shipping'});

        $isNullableOrString = $sameAsShippingIsFalse ? 'string' : 'nullable';

        return [
            'billing_address' => [Rule::requiredIf($sameAsShippingIsFalse), 'array'],
            'billing_address.first_name' => [Rule::requiredIf($sameAsShippingIsFalse), $isNullableOrString],
            'billing_address.last_name' => [Rule::requiredIf($sameAsShippingIsFalse), $isNullableOrString],
            'billing_address.address' => [Rule::requiredIf($sameAsShippingIsFalse), $isNullableOrString],
            'billing_address.city' => [Rule::requiredIf($sameAsShippingIsFalse), $isNullableOrString],
            'billing_address.state' => [Rule::requiredIf($sameAsShippingIsFalse), $isNullableOrString, 'max:2'],
            'billing_address.zip' => [Rule::requiredIf($sameAsShippingIsFalse), $isNullableOrString],
            'billing_address.phone' => [Rule::requiredIf($sameAsShippingIsFalse), $isNullableOrString],
            'billing_address.flat' => [Rule::requiredIf($sameAsShippingIsFalse), 'nullable', 'string'],
            'billing_address.same_as_shipping' => 'required|boolean',
            'payment_by_wallet' => [
                Rule::requiredIf(empty($this->payment_method)),
                'numeric',
            ],
            'coupon.code' => 'sometimes|exists:coupons,code',
        ];
    }
}
