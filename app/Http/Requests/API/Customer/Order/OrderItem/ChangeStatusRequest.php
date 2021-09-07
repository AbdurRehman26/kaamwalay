<?php

namespace App\Http\Requests\API\Customer\Order\OrderItem;

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
        $requestStatus = $this->request->get('status');

        return [
            'status' => ['required','string', Rule::in(['pending', 'missing', 'not_accepted', 'confirmed', 'graded'])],
            'notes' => [
                'string',
                Rule::requiredIf(in_array($requestStatus,['missing','not_accepted']))
            ],
        ];
    }
}
