<?php

namespace App\Http\Requests\API\V3\Admin\Order;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MarkOrderAsAbandonedRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'items' => 'required_without:all|array',
            'items.*' => [
                Rule::exists('referrer_payouts', 'id')->where(function ($query) {
                    return $query->where('referrer_payout_status_id', ReferrerPayoutStatus::STATUS_PENDING);
                }),
            ],
            'all' => 'required_without:orderIds|boolean',
        ];
    }
}
