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
            'name' => ['required', 'unique:card_categories'],
            'image_url' => ['required', 'string'],
        ];
    }
}
