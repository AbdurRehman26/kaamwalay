<?php

namespace App\Http\Requests\API\V1\Admin\Card;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCardSetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'card_series_id' => ['required', 'integer', 'exists:card_series,id'],
            'name' => [
                'required',
                'string',
                Rule::unique('card_sets', 'name')->where(function ($query) {
                    return $query->where('card_series_id', $this->card_series_id);
                }),
            ],
            'image_url' => ['required', 'string'],
            'release_date' => ['required', 'date'],
        ];
    }

}
