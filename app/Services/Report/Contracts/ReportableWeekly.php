<?php

namespace App\Services\Report\Contracts;

interface ReportableWeekly extends Reportable
{
    public function isEligibleToBeSentWeekly(): bool;
}
