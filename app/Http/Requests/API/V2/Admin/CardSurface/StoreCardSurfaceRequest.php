<?php

namespace App\Http\Requests\API\V2\Admin\CardSurface;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCardSurfaceRequest extends FormRequest
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
                Rule::unique('card_surfaces', 'name')->where(function ($query) {
                    return $query->where('card_category_id', $this->card_category_id);
                }),
            ],
        ];
    }
}
