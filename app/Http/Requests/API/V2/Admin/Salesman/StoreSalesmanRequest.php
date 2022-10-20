<?php

namespace App\Http\Requests\API\V2\Admin\Salesman;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StoreSalesmanRequest extends FormRequest
{
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
            'role_ids' => ['required', 'array', Rule::in(DB::table('roles')->pluck('id'))]
        ];
    }
}
