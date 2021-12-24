<?php

namespace App\Http\Requests\API\Admin\Order\OrderItem;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderItemNotesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'notes' => ['nullable', 'string', 'max:300'],
            'internal_notes' => ['nullable', 'string', 'max:300'],
        ];
    }
}
