<?php

namespace App\Http\Requests\API\Customer\Card;

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
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'image_path' => ['required', 'string'],
        ];
    }
}
