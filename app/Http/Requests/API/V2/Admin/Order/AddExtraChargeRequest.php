<?php

namespace App\Http\Requests\API\V2\Admin\Order;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class AddExtraChargeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        /* @var User $user */
        $user = $this->user();

        return $user->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:1'],
            'notes' => ['required'],
        ];
    }
}
