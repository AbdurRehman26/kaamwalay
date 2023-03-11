<?php

namespace App\Http\Requests\API\V3\Admin\ReferralProgram;

use Illuminate\Foundation\Http\FormRequest;

class GetReferralStatRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'stat_name' => ['required', 'string'],
            'time_filter' => ['required', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ];
    }
}
