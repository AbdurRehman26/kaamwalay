<?php

namespace App\Http\Requests\API\V2\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
        return [
            'first_name' => ['required', 'string', 'max: 255'],
            'last_name' => ['nullable', 'string', 'max: 255'],
            'email' => ['required', 'email', 'unique:users'],
            'phone' => ['nullable', 'string'],
            'password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers(),
            ],
            'platform' => [
                'sometimes',
                Rule::in(['web', 'ios', 'android']),
            ],
            'app_generated_id' => ['sometimes', 'string'],
            'marketing_notifications_enabled' => ['required', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'first_name' => 'first name',
            'last_name' => 'last name',
        ];
    }
}
