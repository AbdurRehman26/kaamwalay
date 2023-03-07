<?php

namespace App\Http\Requests\API\V3\Admin\ReferrerPayout;

use App\Models\ReferrerPayoutStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProcessReferrerPayoutsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'items' => 'required_without:all_pending|array',
            'items.*' => [
                Rule::exists('referrer_payouts', 'id')->where(function ($query) {
                    return $query->where('referrer_payout_status_id', ReferrerPayoutStatus::STATUS_PENDING);
                }),
            ],
            'all_pending' => 'required_without:items|boolean',
        ];
    }
}
