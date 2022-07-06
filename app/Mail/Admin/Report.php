<?php

namespace App\Mail\Admin;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Report extends Mailable
{
    use SerializesModels;

    public array $reportData;
    public array $templateInfo;
    protected string $prefix = 'emails.admin.';

    public function __construct(array $reportData, array $templateInfo)
    {
        $this->templateInfo = $templateInfo;
        $this->reportData = $reportData;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
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
        return $this->prefix . $this->templateInfo['name'];
    }
}
