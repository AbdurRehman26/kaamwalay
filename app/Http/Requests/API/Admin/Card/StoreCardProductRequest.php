<?php

namespace App\Http\Requests\API\Admin\Card;

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
            'series_id' => ['sometimes', 'nullable', 'numeric'],
            'series_name' => ['required_without:series_id', 'nullable', 'string'],
            'series_image' => ['required_without:series_id', 'nullable', 'string'],
            'set_id' => ['sometimes', 'nullable', 'numeric'],
            'set_name' => ['required_without:set_id', 'nullable', 'string'],
            'set_image' => ['required_without:set_id', 'nullable', 'string'],
            'card_number' => ['required', 'string'],
            'language' => ['required', 'string', Rule::in(CardProductService::CARD_LANGUAGES)],
            'rarity' => ['required', 'string', Rule::in(CardProductService::CARD_RARITIES)],
            'edition' => ['sometimes', 'nullable', 'string', Rule::in(CardProductService::CARD_EDITIONS)],
            'surface' => ['sometimes', 'nullable', 'string', Rule::in(CardProductService::CARD_SURFACES)],
            'variant' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
