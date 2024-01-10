<?php

namespace App\Http\Requests\API\V2\Customer\Cards;

use Illuminate\Foundation\Http\FormRequest;

class UserCardsOwnershipChangeRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'user_card_ids' => ['required', 'array'],
            'user_card_ids.*' => ['required', 'exists:user_cards,id,user_id,'.auth()->user()->id],
        ];
    }
}
