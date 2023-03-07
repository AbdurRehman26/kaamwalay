<?php

namespace App\Http\Requests\API\V1\Admin\Order\OrderItem;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderItemNotesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'notes' => ['nullable', 'string', 'max:300'],
            'internal_notes' => ['nullable', 'string', 'max:300'],
        ];
    }
}
