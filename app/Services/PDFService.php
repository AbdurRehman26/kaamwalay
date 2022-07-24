<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;

class PDFService
{
    public static function generate(string $viewName, array $data): \Barryvdh\DomPDF\PDF
    {
        $pdf = Pdf::loadView($viewName, $data);
        $pdf->setPaper('A4');

        return $pdf;
    }
}
