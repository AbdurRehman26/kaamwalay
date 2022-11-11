<?php

namespace App\Http\Requests\API\V2\Admin\Salesman;

use Illuminate\Foundation\Http\FormRequest;

class SetActiveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'is_active' => ['required', 'boolean'],
        ];
    }
}
