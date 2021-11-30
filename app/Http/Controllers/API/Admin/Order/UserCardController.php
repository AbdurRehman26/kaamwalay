<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Events\API\Admin\Order\OrderUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\Grades\UserCardGradeDeltaRequest;
use App\Http\Requests\API\Admin\Order\Grades\UserCardGradeRequest;
use App\Http\Resources\API\Admin\Order\UserCardResource;
use App\Models\Order;
use App\Models\UserCard;
use App\Services\Admin\CardGradingService;
use App\Services\AGS\AgsService;

class UserCardController extends Controller
{
    public function updateGradingValues(
        UserCardGradeRequest $request,
        Order $order,
        UserCard $card,
        AgsService $agsService,
        CardGradingService $cardGradingService,
    ): UserCardResource {
        $overallValues = $cardGradingService->calculateOverallValues($request->get('human_grade_values'));

        ['grade' => $grade, 'nickname' => $nickname] = $cardGradingService
            ->calculateOverallAverage($overallValues);

        $card->update(
            $request->only('human_grade_values') + [
                'overall_values' => $overallValues,
                'overall_grade' => $grade,
                'overall_grade_nickname' => $nickname,
            ]
        );

        OrderUpdated::dispatch($order);
        if ($cardGradingService->validateIfHumanGradesAreCompleted($card->human_grade_values)) {
            $response = $agsService->updateHumanGrades(
                $card->userCardCertificate->number,
                $card->only('human_grade_values', 'overall_values', 'overall_grade', 'overall_grade_nickname')
            );
            $card->updateFromAgsResponse($response);
        }

        return new UserCardResource($card);
    }

    public function updateGradeDeltaValue(
        UserCardGradeDeltaRequest $request,
        Order $order,
        UserCard $card,
        AgsService $agsService,
        CardGradingService $cardGradingService
    ) : UserCardResource {
        $card = $cardGradingService->updateGradeDeltaValue($card, $request->grade_delta);

        OrderUpdated::dispatch($order);
        if ($cardGradingService->validateIfHumanGradesAreCompleted($card->human_grade_values)) {
            $response = $agsService->updateHumanGrades(
                $card->userCardCertificate->number,
                $card->only('human_grade_values', 'overall_values', 'overall_grade', 'overall_grade_nickname')
            );
            $card->updateFromAgsResponse($response);
        }

        return new UserCardResource($card);
    }
}
