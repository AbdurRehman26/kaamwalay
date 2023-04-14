<?php

namespace App\Http\Controllers\API\V3\Admin\Order;

use App\Events\API\Admin\Order\OrderUpdated;
use App\Events\API\Admin\UserCard\UserCardGradeRevisedEvent;
use App\Exceptions\Services\Admin\CardGradeIsInvalid;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\Order\Grades\UserCardGradeRequest;
use App\Http\Resources\API\V3\Admin\Order\UserCardResource;
use App\Jobs\Admin\Order\UpdateHumanGradesInAgs;
use App\Models\Order;
use App\Models\UserCard;
use App\Services\Admin\CardGradingService;

class UserCardController extends Controller
{
    /**
     * @throws CardGradeIsInvalid
     */
    public function updateGradingValues(
        UserCardGradeRequest $request,
        Order $order,
        UserCard $card,
        CardGradingService $cardGradingService,
    ): UserCardResource {
        $overallValues = $cardGradingService->calculateOverallValues($request->get('human_grade_values'));
        $gradeDelta = $request->get('grade_delta') ?? 0;
        $grade = $cardGradingService->calculateOverallAverage($overallValues);

        ['grade' => $grade, 'nickname' => $nickname, 'grade_delta' => $gradeDelta] = $cardGradingService
            ->addDeltaValueToOverallGrade($grade, $gradeDelta);

        $card->update(
            $request->only('human_grade_values') + [
                'overall_values' => $overallValues,
                'overall_grade' => $grade,
                'overall_grade_nickname' => $nickname,
                'grade_delta' => $gradeDelta,
            ]
        );

        OrderUpdated::dispatch($order);

        UpdateHumanGradesInAgs::dispatchIf(
            $cardGradingService->validateIfHumanGradesAreCompleted($card->human_grade_values),
            $card
        );

        UserCardGradeRevisedEvent::dispatchIf(
            $card->orderItem->isGraded() && $card->orderItem->order->isGradedOrShipped(),
            $card
        );

        return new UserCardResource($card);
    }
}
