<?php

namespace App\Http\Controllers\API\V1\Customer\Order;

use App\Http\Controllers\Controller;
use App\Services\Order\Shipping\ShippingFeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use function collect;

class ShippingFeeController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $data = $this->validate($request, [
            'items' => 'required|array',
        ]);

        $preparedData = $this->prepareData($data['items']);

        return new JsonResponse([
            'data' => [
                'shipping_fee' => ShippingFeeService::calculate(
                    $preparedData['totalDeclaredValue'],
                    $preparedData['totalNumberOfItems'],
                ),
            ],
        ]);
    }

    protected function prepareData(array $items): array
    {
        $items = collect($items);

        $totalDeclaredValue = $items->map(function (array $item) {
            return $item['quantity'] * $item['declared_value_per_unit'];
        })->sum();

        $totalNumberOfItems = $items->sum('quantity');

        return [
            'totalDeclaredValue' => $totalDeclaredValue,
            'totalNumberOfItems' => $totalNumberOfItems,
        ];
    }
}
