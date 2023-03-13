<?php

namespace App\Http\Requests\API\V2\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ExportDataRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'model' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if (! class_exists('\\App\\Models\\' . ucfirst($value))) {
                        $fail('The ' . $attribute . ' is invalid.');
                    }
                },
            ],
        ];
    }
}
