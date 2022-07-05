<?php

namespace App\Services\Report\Contracts;

interface ReportableMonthly extends Reportable
{
    public function isEligibleToBeSentMonthly(): bool;
}
