<?php

namespace App\Http\Requests\API\V2\Admin\CardLabel;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCardLabelRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'line_one' => ['string', 'required'],
            'line_two' => ['string', 'required'],
            'line_three' => ['string', 'nullable'],
            'line_four' => ['string', 'nullable'],
        ];
    }
}
