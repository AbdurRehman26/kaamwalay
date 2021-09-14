<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Events\API\Admin\Order\OrderUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Order\Grades\UserCardGradeRequest;
use App\Http\Resources\API\Admin\Order\UserCardResource;
use App\Models\UserCard;
use App\Services\Admin\CardGradingService;
use App\Services\AGS\AgsService;

class UserCardController extends Controller
{
    public function updateGradingValues(
        UserCardGradeRequest $request,
        UserCard $userCard,
        AgsService $agsService,
        CardGradingService $cardGradingService
    ): UserCardResource {
        $userCard->update(
            $request->only('human_grade_values')
        );

        OrderUpdated::dispatch($userCard->orderItem->order);
        if ($cardGradingService->validateIfHumanGradesAreCompleted($userCard->human_grade_values)) {
            $response = $agsService->updateHumanGrades(
                $userCard->userCardCertificate->number,
                $request->only('human_grade_values')
            );
            $userCard->update($response);
        }

        return new UserCardResource($userCard);
    }
}
