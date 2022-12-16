<?php

namespace App\Http\Requests\API\V2\Admin\Card;

use App\Services\Admin\Card\CardProductService;
use Illuminate\Validation\Rule;
use App\Http\Requests\API\V1\Admin\Card\StoreCardProductRequest as V1StoreCardProductRequest;

class StoreCardProductRequest extends V1StoreCardProductRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'image_path' => ['required', 'string'],
            'name' => ['required', 'string'],
            'category' => ['required','exists:card_categories,id'],
            'release_date' => ['required', 'date'],
            'series_id' => ['required', 'integer', 'exists:card_series,id'],
            'set_id' => ['required', 'integer', 'exists:card_sets,id'],
            'card_number' => [
                'required',
                'string',
                Rule::unique('card_products', 'card_number_order')->where(function ($query) {
                    return $query->where('card_set_id', $this->set_id)
                        ->where('language', $this->language)
                        ->where('rarity', $this->rarity)
                        ->where('edition', $this->edition ?? 'Unlimited')
                        ->where('surface', $this->surface ?? '')
                        ->where('name', $this->name);
                }),
            ],
            'language' => ['required', 'string', Rule::in(CardProductService::CARD_LANGUAGES)],
            'rarity' => ['required', 'string', Rule::exists('card_rarities', 'name')->where(function ($query) {
                return $query->where('card_category_id', $this->category);
            })],
            'edition' => ['sometimes', 'nullable', 'string', Rule::in(CardProductService::CARD_EDITIONS)],
            'surface' => ['sometimes', 'nullable', 'string', Rule::exists('card_surfaces', 'name')->where(function ($query) {
                return $query->where('card_category_id', $this->category);
            })],
            'variant' => ['sometimes', 'nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'card_number.unique' => 'This card number already exists in this set',
        ];
    }
}
