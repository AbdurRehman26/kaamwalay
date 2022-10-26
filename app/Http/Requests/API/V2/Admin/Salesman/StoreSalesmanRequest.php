<?php

namespace App\Http\Requests\API\V2\Admin\Salesman;

use App\Models\CommissionType;
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
            'commission_type_id' => ['required', Rule::in(CommissionType::pluck('id'))],
            'commission_type_value' => ['required', 'numeric', 'min:1']
        ];
    }
}
