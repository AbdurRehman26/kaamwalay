<?php

namespace App\Http\Requests\API\V2\Admin\Order;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property int $order_status_id
 */
class AssignOrderStatusHistoryRequest extends FormRequest
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
            'order_status_id' => 'exists:order_statuses,id',
        ];
    }
}
