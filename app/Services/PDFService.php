<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade as PDF;

class PDFService
{
    public static function generate(string $viewName, array $data): \Barryvdh\DomPDF\PDF
    {
        /** @var \Barryvdh\DomPDF\PDF $pdf */
        $pdf = PDF::loadView($viewName, $data);
        $pdf->setPaper('A4');

        return $pdf;
    }
}
