<?php

namespace App\Jobs\Admin;

use App\Models\UserCard;
use App\Services\Order\UserCardService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateSocialPreviewsForUserCard implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(protected UserCard $userCard)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(UserCardService $userCardService): void
    {
        $userCardService->generateSocialPreview($this->userCard);
    }
}
