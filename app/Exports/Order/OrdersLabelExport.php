<?php

namespace App\Exports\Order;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class OrdersLabelExport implements FromArray, WithHeadings, WithStyles
{
    public function __construct(protected array $data)
    {
    }

    public function styles(Worksheet $sheet): void
    {
        $sheet->getStyle('A:E')->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);
        $sheet->getStyle('1')->getFont()->setBold(true);
    }


    public function headings(): array
    {
        return [
            'Front Left Column',
            'Right Column',
            'Grade',
            'QR Code Grade URL',
            'Cert ID',
        ];
    }

    public function array(): array
    {
        $cardLabelData[] = [];

        foreach ($this->data as $data) {
            $cardLabelData [] = [
                $data['label_line_one']. "\n" .$data['label_line_two']. "\n" .$data['label_line_three']. "\n" .$data['card_number'],
                $data['grade_nickname']."\n \n \n".$data['certificate_id'],
                $data['final_grade'],
                env('APP_URL').'/card/'.$data['certificate_id'],
                $data['certificate_id'],
            ];
        }
        
        return $cardLabelData;
    }
}
