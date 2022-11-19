<?php

namespace App\Http\Requests\API\V2\Customer;

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
            'marketing_notifications_enabled' => ['boolean', 'required'],
        ];
    }
}
