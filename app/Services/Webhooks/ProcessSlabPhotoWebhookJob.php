<?php

namespace App\Services\Webhooks;

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

        $userCard = UserCard::where('certificate_number', $payload['certificate_number']);
        $userCard->update(['front_slab_image' => $payload['front_slab_image']]);
        // @phpstan-ignore-next-line
        $userCard->get()->searchable();
    }
}
