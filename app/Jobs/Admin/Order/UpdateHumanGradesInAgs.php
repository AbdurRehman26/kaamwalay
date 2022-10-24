<?php

namespace App\Jobs\Admin\Order;

use App\Models\UserCard;
use App\Services\AGS\AgsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateHumanGradesInAgs implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;
    public int $backoff = 300; //seconds

    public function __construct(public UserCard $card)
    {
    }

    public function handle(AgsService $agsService): void
    {
        $response = $agsService->updateHumanGrades(
            $this->card->userCardCertificate->number,
            $this->card->only('human_grade_values', 'overall_values', 'overall_grade', 'overall_grade_nickname')
        );

        $this->card->updateFromAgsResponse($response);
    }
}
