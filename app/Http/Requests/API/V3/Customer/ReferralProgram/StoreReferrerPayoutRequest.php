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
            'payout_account' => ['required', 'string'],
        ];
    }
}
