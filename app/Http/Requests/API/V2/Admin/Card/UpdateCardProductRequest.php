<?php

namespace App\Http\Requests\API\V2\Admin\Card;

use App\Models\CardProduct;
use App\Services\Admin\Card\CardProductService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCardProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'image_path' => ['required', 'string'],
            'name' => ['required', 'string'],
            'release_date' => ['required', 'date'],
            'card_number' => [
                'required',
                'string',
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
}
