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

        if (empty($payload['certificate_number']) || empty($payload['front_slab_image']) || empty($payload['back_slab_image'])) {
            throw new Exception('Invalid payload: '.json_encode($payload));
        }

        $userCard = UserCard::where('certificate_number', $payload['certificate_number'])->firstOrFail();
        $userCard->slab_images = ['front' => $payload['front_slab_image'], 'back' => $payload['back_slab_image']];
        $userCard->save();

        $userCard->searchable();
    }
}
