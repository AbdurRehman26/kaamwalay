<?php

namespace App\Http\Requests\API\Admin\Order;

use App\Models\OrderPayment;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class AddExtraChargeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
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
    public function rules()
    {
        return [
            'amount' => ['required', 'numeric', 'min:1'],
            'notes' => ['required'],
        ];
    }

    protected function passedValidation()
    {
        $this->merge([
            'type' => OrderPayment::PAYMENT_TYPES['extra_charge'],
            'payment_method_id' => $this->route('order')->payment_method_id,
        ]);
    }
}
