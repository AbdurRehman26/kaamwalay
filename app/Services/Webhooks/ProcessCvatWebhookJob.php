<?php

namespace App\Services\Webhooks;

use App\Models\UserCard;
use App\Services\Admin\CardGradingService;
use Exception;
use Spatie\WebhookClient\Jobs\ProcessWebhookJob;

class ProcessCvatWebhookJob extends ProcessWebhookJob
{
    /**
     * @throws Exception
     */
    public function handle(CardGradingService $cardGradingService): void
    {
        $payload = $this->webhookCall->getAttribute('payload');
        if (!isset($payload['action'], $payload['values'])) {
            /** @noinspection ThrowRawExceptionInspection */
            throw new Exception("Invalid payload: '".json_encode($payload,
                    JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT)."'");
        }

        if ($payload['action'] === 'human_grades') {
            $this->processHumanGrades($payload['values'], $cardGradingService);
        } else {
            /** @noinspection ThrowRawExceptionInspection */
            throw new Exception("Undefined case for action: '{$payload['action']}'");
        }
    }

    /**
     * @throws Exception
     */
    private function processHumanGrades(array $values, CardGradingService $cardGradingService): void
    {
        if (!isset($values['grades'])) {
            throw new Exception("No grades available.");
        }

        $card = UserCard::whereCertificateNumber($values['certificateId'])->firstOrFail();
        $grades = $values['grades'];

        $adjustedValues = $cardGradingService
            ->addDeltaValueToOverallGrade($grades['overall_grade']['grade'], $card->grade_delta);

        $card->update([
            'human_grade_values' => [
                "back" => [
                    "edge" => $grades['back_edges_human_grade'],
                    "center" => $grades['back_centering_human_grade'],
                    "corner" => $grades['back_corners_human_grade'],
                    "surface" => $grades['back_surface_human_grade'],
                ],
                "front" => [
                    "edge" => $grades['front_edges_human_grade'],
                    "center" => $grades['front_centering_human_grade'],
                    "corner" => $grades['front_corners_human_grade'],
                    "surface" => $grades['front_surface_human_grade'],
                ]
            ],
            'overall_values' => [
                "edge" => $grades['overall_edges_grade'],
                "center" => $grades['overall_centering_grade'],
                "corner" => $grades['overall_corners_grade'],
                "surface" => $grades['overall_surface_grade'],
            ],
            'overall_grade' => $adjustedValues['grade'],
            'overall_grade_nickname' => $adjustedValues['nickname'],
        ]);
    }
}
