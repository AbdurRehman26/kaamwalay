<?php

namespace App\Http\Requests\API\Auth;

use Illuminate\Foundation\Http\FormRequest;

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
            'last_name' => ['required', 'string', 'max: 255'],
            'email' => ['required', 'email', 'unique:users'],
            'phone' => ['nullable', 'string'],
            'password' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'unique:users', 'max:50'],
        ];
    }
}