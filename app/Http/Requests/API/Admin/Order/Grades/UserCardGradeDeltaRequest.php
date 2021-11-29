<?php

namespace App\Http\Requests\API\Admin\Order\Grades;

use Illuminate\Foundation\Http\FormRequest;

class UserCardGradeDeltaRequest extends FormRequest
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
            'grade_delta' => ['required', 'regex:/^(-)?\d(\.[0|5])?$/', 'numeric'],
        ];
    }
}
