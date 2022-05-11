<?php

namespace App\Http\Requests\API\V2\Admin\VaultShipment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVaultShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user->isAdmin();
    }

    public function rules(): array
    {
        return [
            'shipping_provider' => ['required','string'],
            'tracking_number' => ['required','string'],
        ];
    }
}
