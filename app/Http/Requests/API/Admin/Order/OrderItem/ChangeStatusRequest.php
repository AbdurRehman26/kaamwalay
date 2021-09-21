<?php

namespace App\Http\Requests\API\Admin\Order\OrderItem;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'status' => [
                'required',
                Rule::when(fn ($value) => is_numeric($value->status), 'exists:order_item_statuses,id'),
                Rule::when(fn ($value) => ! is_numeric($value->status), 'exists:order_item_statuses,code'),
            ],
            'notes' => ['nullable', 'string'],
        ];
    }
}
