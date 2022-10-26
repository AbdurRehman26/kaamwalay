<?php

namespace App\Http\Requests\API\V2\Admin\Salesman;

use Illuminate\Foundation\Http\FormRequest;

class SalesmanDashboardStatsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'salesman_id' => ['required', 'integer', 'exists:users,id'],
            'from_date' => ['sometimes'],
            'to_date' => ['sometimes']
        ];
    }
}
