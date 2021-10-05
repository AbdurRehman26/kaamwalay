<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Events\API\Admin\Order\OrderUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\Grades\UserCardGradeRequest;
use App\Http\Resources\API\Admin\Order\UserCardGradeUpdateResource;
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
        CardGradingService $cardGradingService
    ): UserCardGradeUpdateResource {
        $card->update(
            $request->only('human_grade_values', 'overall_values', 'overall_grade', 'overall_grade_nickname')
        );

        OrderUpdated::dispatch($order);
        if ($cardGradingService->validateIfHumanGradesAreCompleted($card->human_grade_values)) {
            $response = $agsService->updateHumanGrades(
                $card->userCardCertificate->number,
                $request->only('human_grade_values')
            );
            $card->updateFromAgsResponse($response);
        }

        return new UserCardGradeUpdateResource($card);
    }
}
