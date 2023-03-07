<?php

namespace App\Http\Requests\API\V1\Admin\Order\OrderItem;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeStatusRequest extends FormRequest
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
            'status' => [
                'required',
                Rule::when(fn ($value) => is_numeric($value->status), 'exists:order_item_statuses,id'),
                Rule::when(fn ($value) => ! is_numeric($value->status), 'exists:order_item_statuses,code'),
            ],
            'notes' => ['nullable', 'string'],
        ];
    }
}
