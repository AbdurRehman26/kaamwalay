<?php

namespace App\Http\Requests\API\V1\Files;

use Illuminate\Foundation\Http\FormRequest;

class PresignUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'file_name' => ['required'],
            'content_type' => ['required'],
            'size' => ['required', 'integer'],
            'prefix' => [],
            'directory' => [],
            'suffix' => [],
            'bucket' => [],
        ];
    }
}
