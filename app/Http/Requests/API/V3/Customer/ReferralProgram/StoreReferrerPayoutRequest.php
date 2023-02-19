<?php

namespace App\Http\Requests\API\V3\Customer\ReferralProgram;

use App\Models\Referrer;
use Illuminate\Foundation\Http\FormRequest;

class StoreReferrerPayoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isCustomer();
    }

    public function rules(): array
    {
        return [
            'amount' => [
                'required',
                'regex:/^\d+(\.\d{1,2})?$/',
                'gte:1',
                'lte:'. Referrer::whereUserId(auth()->user()->id)->first()->withdrawable_commission,
            ],
            'payout_account' => ['required', 'string'],
        ];
    }
}
