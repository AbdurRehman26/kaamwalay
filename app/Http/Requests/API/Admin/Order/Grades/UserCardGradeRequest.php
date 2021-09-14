<?php

namespace App\Http\Requests\API\Admin\Order\Grades;

use Illuminate\Foundation\Http\FormRequest;

class UserCardGradeRequest extends FormRequest
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
            'human_grade_values' => ['required', 'array'],
            'human_grade_values.front' => ['required_without_all:human_grade_values.back', 'array', 'min:1'],
            'human_grade_values.front.center' => [
                'numeric',
                'max:10',
                'min:0',
            ],
            'human_grade_values.front.surface' => ['numeric', 'max:10', 'min:0'],
            'human_grade_values.front.corner' => ['numeric', 'max:10', 'min:0'],
            'human_grade_values.front.edge' => ['numeric', 'max:10', 'min:0'],
            'human_grade_values.back' => ['required_without_all:human_grade_values.front', 'array', 'min:1'],
            'human_grade_values.back.center' => ['numeric', 'max:10', 'min:0'],
            'human_grade_values.back.surface' => ['numeric', 'max:10', 'min:0'],
            'human_grade_values.back.corner' => ['numeric', 'max:10', 'min:0'],
            'human_grade_values.back.edge' => ['numeric', 'max:10', 'min:0'],
        ];
    }
}
