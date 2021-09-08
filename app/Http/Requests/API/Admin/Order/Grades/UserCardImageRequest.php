<?php

namespace App\Http\Requests\API\Admin\Order\Grades;

use App\Models\UserCard;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserCardImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'source' => ['required', 'url'],
            'field' => ['required', Rule::in(UserCard::IMAGE_FIELDS)],
        ];
    }
}
