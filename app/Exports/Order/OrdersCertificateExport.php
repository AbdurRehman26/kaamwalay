<?php

namespace App\Exports\Order;

use App\Models\CardProduct;
use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class OrdersCertificateExport implements FromArray, WithHeadings
{
    protected Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function styles(Worksheet $sheet): void
    {
        $sheet->getStyle('A:E')->getAlignment()->setVertical(Alignment::VERTICAL_TOP);
        $sheet->getStyle('1')->getFont()->setBold(true);
    }

    public function headings(): array
    {
        return [
            'Cert. ID / Name',
            'Submission #',
        ];
    }

    public function array(): array
    {
        $array = [];
        foreach ($this->order->orderItems as $orderItem){
            if(empty($orderItem->userCard)){
                continue;
            }
            $array [] = [
                '#'. $orderItem->userCard->certificate_number . "\n" . $this->getName($orderItem->cardProduct),
                $this->order->order_number
            ];
        }

        return $array;
    }

    protected function getName(CardProduct $cardProduct): string
    {
        return $cardProduct->name .  ($cardProduct->surface ? ' - ' . $cardProduct->surface : '');
    }
}
