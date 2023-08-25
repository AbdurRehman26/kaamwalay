<?php

namespace App\Http\Requests\API\V3\Admin\Card;

use Illuminate\Foundation\Http\FormRequest;

class StoreCardCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'card_category_type_id' => ['required', 'exists:card_category_types,id'],
            'name' => ['required', 'unique:card_categories'],
            'image_url' => ['required', 'string'],
        ];
    }
}
