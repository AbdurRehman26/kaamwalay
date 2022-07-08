<?php

namespace App\Services\Admin\Report\Contracts;

interface Reportable
{
    public function shouldSendNow(): bool;

    public function getReportTitle(): string;

    public function getTemplate(): string;

    public function getReportData(): array;
}
