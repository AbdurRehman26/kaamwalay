<?php

namespace App\Http\Requests\API\Admin\Card;

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
            'image_path' => 'required|string',
            'name' => 'required|string',
            'category' => 'required|string',
            'release_date' => 'required|date',
            'series' => 'required|string',
            'set' => 'required|string',
            'card_number' => 'required|string',
            'language' => 'required|string',
            'rarity' => 'required|string',
            'edition' => 'sometimes|nullable|string',
            'surface' => 'sometimes|nullable|string',
            'variant' => 'sometimes|nullable|string',
        ];
    }
}
