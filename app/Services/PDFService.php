<?php

namespace App\Services;

class PDFService
{
    public static function generate(string $viewName, array $data)
    {
        $pdf = \PDF::loadView($viewName, $data);
        $pdf->setPaper('A4');

        return $pdf;
    }
}
