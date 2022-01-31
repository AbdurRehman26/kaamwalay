<?php

namespace App\Http\Controllers\API\V1\Admin\Order;

use App\Events\API\Admin\Order\OrderUpdated;
use App\Events\API\Admin\OrderItem\OrderItemStatusChangedEvent;
use App\Events\API\Admin\UserCard\UserCardGradeRevisedEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\Order\Grades\UserCardGradeRequest;
use App\Http\Resources\API\V1\Admin\Order\UserCardResource;
use App\Models\Order;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
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
        if ($cardGradingService->validateIfHumanGradesAreCompleted($card->human_grade_values)) {
            $response = $agsService->updateHumanGrades(
                $card->userCardCertificate->number,
                $card->only('human_grade_values', 'overall_values', 'overall_grade', 'overall_grade_nickname')
            );
            $card->updateFromAgsResponse($response);
        }

        if ($card->orderItem->order_item_status_id === OrderItemStatus::GRADED
        && in_array($card->orderItem->order->order_status_id, [OrderStatus::GRADED, OrderStatus::SHIPPED])) {
            UserCardGradeRevisedEvent::dispatch($card);
        }

        return new UserCardResource($card);
    }
}
