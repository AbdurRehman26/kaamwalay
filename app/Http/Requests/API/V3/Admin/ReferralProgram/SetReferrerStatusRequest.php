<?php

namespace App\Http\Requests\API\V3\Admin\ReferralProgram;

use Illuminate\Foundation\Http\FormRequest;

class SetReferrerStatusRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'is_referral_active' => ['required', 'boolean'],
        ];
    }
}
