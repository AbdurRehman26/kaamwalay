<?php

namespace App\Exports\Order;

use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class OrdersExport implements FromCollection, WithHeadings, WithMapping
{
    protected string $date;

    public function __construct(string $date)
    {
        $this->date = $date;
    }

    public function collection()
    {
        return Order::placed()->whereBetween(
            'created_at',
            [
                Carbon::parse($this->date)->startOfDay(),
                Carbon::parse($this->date)->endOfDay(),
            ]
        )->get();
    }

    public function headings(): array
    {
        return [
            'Date',
            'Submission #',
            'Service Level',
            'Turnaround Time',
            'Card',
            'Quantity',
            'Declared Value Per Unit $',
            'Shipping Address (Name)',
            'Shipping Address (Address)',
            'Shipping Address (Apartment)',
            'Shipping Address (State)',
            'Shipping Address (Phone)',
            'Customer (Name)',
            'Customer (Email)',
            'Service Fee $',
            'Shipping Fee $',
            'Grand Total $',
        ];
    }

    public function map($order): array
    {
        return $order->orderItems->map(function (OrderItem $orderItem, $key) use ($order) {
            $wholeRowData = [
                Carbon::parse($order->date)->format('m/d/Y'),
                $order->order_number,
                $order->paymentPlan->price . ' / Card',
                $order->paymentPlan->turnaround,
                $orderItem->cardProduct->getSearchableName(),
                $orderItem->quantity,
                $orderItem->declared_value_per_unit,
                $order->shippingAddress->getFullName(),
                $order->shippingAddress->address,
                $order->shippingAddress->flat,
                $order->shippingAddress->state,
                $order->shippingAddress->phone,
                $order->user->getFullName(),
                $order->user->email,
                $order->service_fee,
                $order->shipping_fee,
                $order->grand_total,
            ];

            $partialRowData = [
                null,
                null,
                null,
                null,
                'Card ' => $orderItem->cardProduct->getSearchableName(),
                'Quantity' => $orderItem->quantity,
                'Declared Value Per Unit $' => $orderItem->declared_value_per_unit,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ];

            if ($order->orderItems->count() > 1) {
                if ($key == 0) {
                    return $wholeRowData;
                } else {
                    return $partialRowData;
                }
            } else {
                return $wholeRowData;
            }
        })->toArray();
    }
}
