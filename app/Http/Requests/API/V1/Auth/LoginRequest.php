<?php

namespace App\Http\Requests\API\V1\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LoginRequest extends FormRequest
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
            'email' => ['required'],
            'password' => ['required'],
            'platform' => [
                'sometimes',
                Rule::in(['web', 'ios', 'android']),
            ],
        ];
    }
}
