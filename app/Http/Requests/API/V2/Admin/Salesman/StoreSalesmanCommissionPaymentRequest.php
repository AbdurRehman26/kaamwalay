<?php

namespace App\Http\Requests\API\V2\Admin\Salesman;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreSalesmanCommissionPaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var User $user */
        $user = $this->user();

        return $user->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric'],
            'file_url' => ['nullable', 'url'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
