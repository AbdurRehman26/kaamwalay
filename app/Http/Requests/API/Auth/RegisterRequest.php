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
            'phone' => ['sometimes', 'string'],
            'password' => ['required', 'string', 'max:255', 'confirmed'],
            'username' => ['required', 'string', 'unique:users', 'max:12'],
        ];
    }

    /**
     * Handle a passed validation attempt.
     *
     * @return void
     */
    protected function passedValidation()
    {
        $this->merge(
            [
                'password' => bcrypt($this->get('password')),
            ]
        );
    }
}
