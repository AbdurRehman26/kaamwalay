<?php

namespace App\Http\Requests\API\V2\Admin\Card;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCardRarityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'card_category_id' => ['required', 'integer', 'exists:card_categories,id'],
            'name' => [
                'required',
                'string',
                Rule::unique('card_rarities', 'name')->where(function ($query) {
                    return $query->where('card_category_id', $this->card_category_id);
                }),
            ],
        ];
    }
}
