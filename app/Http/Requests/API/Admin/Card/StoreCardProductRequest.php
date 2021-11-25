<?php

namespace App\Http\Requests\API\Admin\Card;

use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
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
            'series_name' => [
                'required_without:series_id',
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    $seriesCount = CardSeries::select('id')->where('card_category_id', $this->category)->where('name', 'like', $value)->count();
                    if ($seriesCount > 0) {
                        $fail('This series name already exists in this category');
                    }
                },
            ],
            'series_image' => ['required_without:series_id', 'nullable', 'string'],
            'set_id' => ['sometimes', 'nullable', 'numeric'],
            'set_name' => [
                'required_without:set_id',
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    if ($this->series_id) {
                        $setCount = CardSet::select('id')->where('card_series_id', $this->series_id)->where('name', 'like', $value)->count();
                        if ($setCount > 0) {
                            $fail('This set name already exists in this series');
                        }
                    }
                },
            ],
            'set_image' => ['required_without:set_id', 'nullable', 'string'],
            'card_number' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    if ($this->set_id) {
                        $cardCount = CardProduct::select('id')->where('card_set_id', $this->set_id)->where('card_number_order', 'like', $value)->count();
                        if ($cardCount > 0) {
                            $fail('This card number already exists in this set');
                        }
                    }
                },
                function ($attribute, $value, $fail) {
                    $fail('Test This card number already exists in this set');
                },
            ],
            'language' => ['required', 'string', Rule::in(CardProductService::CARD_LANGUAGES)],
            'rarity' => ['required', 'string', Rule::in(CardProductService::CARD_RARITIES)],
            'edition' => ['sometimes', 'nullable', 'string', Rule::in(CardProductService::CARD_EDITIONS)],
            'surface' => ['sometimes', 'nullable', 'string', Rule::in(CardProductService::CARD_SURFACES)],
            'variant' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
