<?php

namespace App\Http\Requests\API\V1\Customer\Card;

use Illuminate\Foundation\Http\FormRequest;

class StoreCardProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'card_category_id' => ['required', 'exists:card_categories,id'],
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'image_path' => ['required', 'string'],
        ];
    }
}
