<?php

namespace App\Http\Requests\API\V3\Admin\ReferralProgram;

use Illuminate\Foundation\Http\FormRequest;

class GetReferralStatRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'stat_name' => ['required', 'string'],
            'time_filter' => ['required', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ];
    }
}
