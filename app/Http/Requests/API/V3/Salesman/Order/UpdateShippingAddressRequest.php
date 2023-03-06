<?php

namespace App\Http\Requests\API\V3\Salesman\Order;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;

class UpdateShippingAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Order $order */
        $order = $this->route('order');

        return auth()->user()->isSalesman() && $order->salesman()->exists() && $order->salesman()->is(auth()->user());
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
            'address' => ['required', 'string'],
            'address_2' => ['nullable', 'string'],
            'city' => ['required', 'string'],
            'state' => ['required', 'string'],
            'zip' => ['required', 'string'],
            'phone' => ['nullable', 'string'],
            'flat' => ['nullable', 'string'],
            'country_code' => ['sometimes', 'exists:countries,code'],
        ];
    }
}
