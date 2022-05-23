<?php

namespace App\Http\Controllers\API\V2\Customer\Order;

use App\Http\Controllers\API\V1\Customer\Order\ShippingFeeController as V1ShippingFeeController;
use App\Models\ShippingMethod;
use App\Services\Order\Shipping\ShippingFeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingFeeController extends V1ShippingFeeController
{
    public function __invoke(Request $request): JsonResponse
    {
        $rules = [
            'items' => 'required|array',
            'shipping_method_id' => ['nullable', 'exists:shipping_methods,id'],
            'shipping_address' => ['sometimes', 'nullable', 'array'],
        ];

        if ($request->shipping_address) {
            $rules = array_merge($rules, [
                'shipping_address.address' => ['required', 'string'],
                'shipping_address.city' => ['required', 'string'],
                'shipping_address.state' => ['required', 'string'],
                'shipping_address.zip' => ['required', 'string'],
                'shipping_address.phone' => ['required', 'string'],
                'shipping_address.country_code' => ['required', 'string', 'exists:countries,code'],
            ]);
        }

        $data = $this->validate($request, $rules);
        $preparedData = $this->prepareData($data['items']);

        return new JsonResponse([
            'data' => [
                'shipping_fee' => ShippingFeeService::calculate(
                    $preparedData['totalDeclaredValue'],
                    $preparedData['totalNumberOfItems'],
                    ShippingMethod::find($request->input('shipping_method_id')),
                    array_key_exists('shipping_address', $data) ? $data['shipping_address'] : ['country_code' => 'US']
                ),
            ],
        ]);
    }
}
