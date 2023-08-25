<?php

namespace App\Mail\Admin;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReportMail extends Mailable
{
    use SerializesModels;

    protected string $prefix = 'emails.admin.reports.';

    public function __construct(public array $reportData, public array $templateInfo)
    {
    }

    /**
     * Build the message.
     */
    public function build(): static
    {
        return $this->markdown($this->getTemplateName())
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->with([
                'report' => $this->reportData,
                'templateInfo' => $this->templateInfo,
            ]);
    }

    protected function getTemplateName(): string
    {
        return $this->prefix.$this->templateInfo['name'];
    }
}
