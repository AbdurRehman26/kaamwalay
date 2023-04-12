<?php

namespace App\Http\Requests\API\V3\Admin\Order;

use App\Enums\Order\OrderPaymentStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MarkOrderAsAbandonedRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'items' => 'required|array',
            'items.*' => [
                Rule::exists('orders', 'id')->where(function ($query) {
                    return $query->where('payment_status', '!=', OrderPaymentStatusEnum::PAID);
                }),
            ],
        ];
    }
}
