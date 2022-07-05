<?php

namespace App\Services\Report\Contracts;

interface ReportableQuarterly extends Reportable
{
    public function isEligibleToBeSentQuarterly(): bool;
}
