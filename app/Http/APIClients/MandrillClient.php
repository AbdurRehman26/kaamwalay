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
        array $recipients,
        string $subject,
        string $templateName,
        array $templateContent = []
    ): Response {
        return $this->sendRequest(
            $recipients,
            $subject,
            $templateName,
            $templateContent
        );
    }

    protected function sendRequest(array $recipients, string $subject, string $templateName, array $templateContent): Response
    {
        return Http::post($this->baseUrl . '/send-template', [
            'key' => $this->apiKey,
            'template_name' => $templateName,
            'template_content' => [],
            'message' => [
                'subject' => $subject,
                'from_email' => config('mail.from.address'),
                'from_name' => config('mail.from.name'),
                'to' => $this->prepareRecipients($recipients),
                'global_merge_vars' => $this->prepareTemplateContent($templateContent),
                'merge_language' => 'handlebars',
            ],
        ]);
    }

    protected function prepareTemplateContent(array $templateContent): array
    {
        return collect($templateContent)->flatMap(function (
            $placeholderValue,
            $placeholderKey
        ) {
            return [
                [
                    'name' => $placeholderKey,
                    'content' => $placeholderValue,
                ],
            ];
        })->toArray();
    }

    protected function prepareRecipients(array $recipients): array
    {
        return collect($recipients)->map(function (array $recipient) {
            foreach ($recipient as $email => $name) {
                return [
                    'email' => $email,
                    'name' => $name,
                ];
            }

            return [];
        })->toArray();
    }
}
