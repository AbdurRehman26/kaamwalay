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
            'human_grade_values.front.center' => ['required', 'numeric', 'max:10', 'min:0'],
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

    protected function passedValidation()
    {
        $cardGradingService = new CardGradingService;
        $overallValues = $cardGradingService->calculateOverallValues($this->get('human_grade_values'));
        $this->merge([
            'overall_values' => $overallValues,
            'overall_grade' => $cardGradingService->calculateOverallAverage($overallValues),
        ]);
    }
}
