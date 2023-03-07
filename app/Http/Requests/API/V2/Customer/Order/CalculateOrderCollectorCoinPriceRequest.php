<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CalculateOrderCollectorCoinPriceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'payment_blockchain_network' => [
                'required',
                'integer',
                Rule::in(
                    explode(
                        ',',
                        config('robograding.web3.supported_networks', [])
                    )
                ),
            ],
            'payment_by_wallet' => ['required', 'numeric'],
        ];
    }
}
