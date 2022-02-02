<?php

namespace App\Http\Requests\API\V1\Admin\Card;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCardSeriesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'card_category_id' => ['required', 'integer', 'exists:card_categories,id'],
            'name' => [
                'required',
                'string',
                Rule::unique('card_series', 'name')->where(function ($query) {
                    return $query->where('card_category_id', $this->card_category_id);
                }),
            ],
            'image_url' => ['required', 'string'],
        ];
    }

}
