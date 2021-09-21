<?php

namespace App\Http\Requests\API\Admin\Order\Grades;

use Illuminate\Foundation\Http\FormRequest;

class UserCardGradeRequest extends FormRequest
{
    protected $stopOnFirstFailure = true;
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
            'human_grade_values.front' => ['required', 'array'],
            'human_grade_values.front.center' => ['required', 'numeric','max:10','min:0',],
            'human_grade_values.front.surface' => ['required', 'numeric', 'max:10', 'min:0'],
            'human_grade_values.front.corner' => ['required', 'numeric', 'max:10', 'min:0'],
            'human_grade_values.front.edge' => ['required', 'numeric', 'max:10', 'min:0'],
            'human_grade_values.back' => ['required', 'array'],
            'human_grade_values.back.center' => ['required', 'numeric', 'max:10', 'min:0'],
            'human_grade_values.back.surface' => ['required', 'numeric', 'max:10', 'min:0'],
            'human_grade_values.back.corner' => ['required', 'numeric', 'max:10', 'min:0'],
            'human_grade_values.back.edge' => ['required', 'numeric', 'max:10', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'human_grade_values.front' => 'Human Grades front',
            'human_grade_values.front.center' => 'Human Grades front centering',
            'human_grade_values.front.surface' => 'Human Grades front surface',
            'human_grade_values.front.edge' => 'Human Grades front edges',
            'human_grade_values.front.corner' => 'Human Grades front corners',
            'human_grade_values.back' => 'Human Grades back',
            'human_grade_values.back.center' => 'Human Grades back centering',
            'human_grade_values.back.surface' => 'Human Grades back surface',
            'human_grade_values.back.edge' => 'Human Grades back edges',
            'human_grade_values.back.corner' => 'Human Grades back corners',
        ];
    }
}
