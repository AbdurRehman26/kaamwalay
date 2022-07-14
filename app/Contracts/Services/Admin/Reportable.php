<?php

namespace App\Contracts\Services\Admin;

interface Reportable
{
    public function shouldSendNow(): bool;

    public function getReportTitle(): string;

    public function getTemplate(): string;

    public function getReportData(): array;
}
