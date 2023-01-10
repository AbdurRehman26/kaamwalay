<?php

namespace App\Http\Requests\API\V2\Admin\CardLabel;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderLabelsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'data' => ['required', 'array'],
            'data.*.certificate_number' => ['required', 'string'],
            'data.*.line_one' => ['required', 'string'],
            'data.*.line_two' => ['required', 'string'],
            'data.*.line_three' => ['nullable', 'string'],
            'data.*.line_four' => ['nullable', 'string'],
            'data.*.persist_changes' => ['required', 'boolean'],
        ];
    }
}
