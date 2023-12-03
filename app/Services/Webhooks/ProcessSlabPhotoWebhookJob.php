<?php

namespace App\Services\Webhooks;

use App\Models\OrderItem;
use App\Models\UserCard;
use Exception;
use Spatie\WebhookClient\Jobs\ProcessWebhookJob;

class ProcessSlabPhotoWebhookJob extends ProcessWebhookJob
{
    /**
     * @throws Exception
     */
    public function handle(): void
    {
        $payload = $this->webhookCall->getAttribute('payload');
        // @phpstan-ignore-next-line
        UserCard::where('certificate_number', $payload['certificate_number'])->get()->searchable();
    }
}
