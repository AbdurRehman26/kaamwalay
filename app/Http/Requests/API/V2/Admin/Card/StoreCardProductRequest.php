<?php

namespace App\Http\Requests\API\V2\Admin\Card;

use App\Services\Admin\Card\CardProductService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCardProductRequest extends FormRequest
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
            'card_number' => ['required', 'string'],
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
}
