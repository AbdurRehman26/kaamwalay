<?php

namespace App\Http\Requests\API\V2\Customer\Profile;

use Illuminate\Foundation\Http\FormRequest;

class ToggleMarketingNotificationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_marketing_notifications_enabled' => ['boolean', 'required'],
        ];
    }
}
