<?php

namespace App\Http\Requests\API\V1\Admin\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MarkItemsPendingRequest extends FormRequest
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
            'items' => 'required|array|min:1',
            'items.*' => 'exists:order_items,id',
        ];
    }
}
