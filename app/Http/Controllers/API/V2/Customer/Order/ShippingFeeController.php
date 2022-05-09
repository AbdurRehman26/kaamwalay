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
        $data = $this->validate($request, [
            'items' => 'required|array',
            'shipping_method_id' => ['nullable', 'exists:shipping_methods,id'],
        ]);

        $preparedData = $this->prepareData($data['items']);

        return new JsonResponse([
            'data' => [
                'shipping_fee' => ShippingFeeService::calculate(
                    $preparedData['totalDeclaredValue'],
                    $preparedData['totalNumberOfItems'],
                    ShippingMethod::find($request->input('shipping_method_id')),
                ),
            ],
        ]);
    }
}
