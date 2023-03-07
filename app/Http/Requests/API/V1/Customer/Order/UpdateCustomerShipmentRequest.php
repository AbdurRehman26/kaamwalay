<?php

namespace App\Http\Requests\API\V1\Customer\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerShipmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'shipping_provider' => 'required|string',
            'tracking_number' => 'required|string',
        ];
    }
}
