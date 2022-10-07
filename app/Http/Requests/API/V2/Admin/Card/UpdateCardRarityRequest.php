<?php

namespace App\Http\Requests\API\V2\Admin\Card;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCardRarityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
        ];
    }
}
