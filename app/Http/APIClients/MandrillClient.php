<?php

namespace App\Http\APIClients;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class MandrillClient
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = 'https://mandrillapp.com/api/1.0/messages';
        $this->apiKey = config('services.mandrill.key');
    }

    public function sendEmailWithTemplate(
        string $recipientEmail,
        string $recipientName,
        string $subject,
        string $templateName,
        array $templateContent = []
    ): Response {
        $templateContent = collect($templateContent)->mapWithKeys(function (string $placeholderValue, string $placeholderKey) {
            return [
                $placeholderKey => [
                    'name' => $placeholderKey,
                    'content' => $placeholderValue,
                ],
            ];
        })->values()->toArray();

        return Http::post($this->baseUrl . '/send-template', [
            'key' => $this->apiKey,
            'template_name' => $templateName,
            'template_content' => [],
            'message' => [
                'subject' => $subject,
                'from_email' => config('mail.from.address'),
                'from_name' => config('mail.from.name'),
                'to' => [[
                    'email' => $recipientEmail,
                    'name' => $recipientName,
                ]],
                'global_merge_vars' => $templateContent,
                'merge_language' => 'handlebars',
            ],
        ]);
    }
}
