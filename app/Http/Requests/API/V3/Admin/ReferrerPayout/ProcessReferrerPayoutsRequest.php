<?php

namespace App\Http\Requests\API\V3\Admin\ReferrerPayout;

use Illuminate\Foundation\Http\FormRequest;

class ProcessReferrerPayoutsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        //TODO: Validate payout status as well
        return [
            'items' => 'required|array',
            'items.*' => 'exists:referrer_payouts,id'
        ];
    }
}
