<?php

namespace App\Http\Requests\API\V3\Admin\Taggable;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TaggableModelRequest extends FormRequest
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
                    if (! class_exists('\\App\\Models\\'.ucfirst($value))) {
                        $fail('The '.$attribute.' is invalid.');
                    }
                },
            ],
            'model_ids' => [
                'required',
                'array',
            ],
            'model_ids.*' => Rule::exists(Str::plural(request()->model), 'id'),
            'tags' => [
                'required',
                'array',
            ],
            'tags.*' => [
                'string',
            ],
        ];
    }
}
