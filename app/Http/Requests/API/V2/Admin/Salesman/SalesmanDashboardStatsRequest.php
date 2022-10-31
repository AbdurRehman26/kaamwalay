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
            'filter.from_date' => ['sometimes'],
            'filter.to_date' => ['sometimes']
        ];
    }
}
