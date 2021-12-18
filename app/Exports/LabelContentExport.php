<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LabelContentExport implements FromArray, WithHeadings, WithStyles
{
    public function __construct(protected array $data)
    {
    }

    public function styles(Worksheet $sheet): void
    {
        $sheet->getStyle('1')->getFont()->setBold(true);
        $sheet->getStyle('A')->getAlignment()->setWrapText(true);
        $sheet->getStyle('B')->getAlignment()->setWrapText(true);
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
                $data['grade_nickname']. "\n" .$data['certificate_id'],
                $data['final_grade'],
                'https://robograding.com/card/'.$data['certificate_id'],
                $data['certificate_id'],
            ];
        }

        return $cardLabelData;
    }
}
