<?php

namespace App\Http\Requests\API\Admin\Order\Grades;

use App\Services\Admin\CardGradingService;
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
            'human_grade_values.front' => ['required', 'array'],
            'human_grade_values.front.center' => ['numeric','max:10','min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'human_grade_values.front.surface' => ['numeric', 'max:10', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'human_grade_values.front.corner' => ['numeric', 'max:10', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'human_grade_values.front.edge' => ['numeric', 'max:10', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'human_grade_values.back' => ['required', 'array'],
            'human_grade_values.back.center' => ['numeric', 'max:10', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'human_grade_values.back.surface' => ['numeric', 'max:10', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'human_grade_values.back.corner' => ['numeric', 'max:10', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'human_grade_values.back.edge' => ['numeric', 'max:10', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
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

    public function messages()
    {
        $message = 'can only have maximum of 2 decimal places.';

        return[
            'human_grade_values.front.center.regex' => 'Human Grades front centering ' . $message,
            'human_grade_values.front.surface.regex' => 'Human Grades front surface ' . $message,
            'human_grade_values.front.edge.regex' => 'Human Grades front edges ' . $message,
            'human_grade_values.front.corner.regex' => 'Human Grades front corners ' . $message,
            'human_grade_values.back.center.regex' => 'Human Grades back centering ' . $message,
            'human_grade_values.back.surface.regex' => 'Human Grades back surface ' . $message,
            'human_grade_values.back.edge.regex' => 'Human Grades back edges ' . $message,
            'human_grade_values.back.corner.regex' => 'Human Grades back corners ' . $message,
        ];
    }
}
