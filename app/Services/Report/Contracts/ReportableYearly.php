<?php

namespace App\Services\Report\Contracts;

interface ReportableYearly extends Reportable
{
    public function isEligibleToBeSentYearly(): bool;
}
