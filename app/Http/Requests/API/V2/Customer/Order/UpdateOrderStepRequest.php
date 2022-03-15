<?php

namespace App\Http\Requests\API\V2\Customer\Order;

use App\Enums\Order\OrderStepEnum;
use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStepRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Order $order */
        $order = $this->route('order');

        return $order->isPayable();
    }

    public function rules(): array
    {
        return [
            'order_step' => ['required', Rule::in($this->getOrderSteps())],
        ];
    }

    protected function getOrderSteps(): array
    {
        return array_values([
            OrderStepEnum::CARDS_SELECTION_STEP,
            OrderStepEnum::SHIPPING_DETAILS_STEP,
            OrderStepEnum::PROMO_DISCOUNT_STEP,
            OrderStepEnum::ORDER_REVIEW_STEP,
            OrderStepEnum::ORDER_SUBMITTED_STEP,
        ]);
    }
}
