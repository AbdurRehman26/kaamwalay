<?php

namespace App\Http\Controllers\API\Admin\Order;

use App\Events\API\Admin\Order\OrderUpdated;
use App\Http\Controllers\Controller;
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
        CardGradingService $cardGradingService
    ): UserCardResource {
        // dd($card);
        $card->update(
            $request->only('human_grade_values')
        );

        OrderUpdated::dispatch($card->orderItem->order);
        if ($cardGradingService->validateIfHumanGradesAreCompleted($card->human_grade_values)) {
            $response = $agsService->updateHumanGrades(
                $card->userCardCertificate->number,
                $request->only('human_grade_values')
            );
            $card->update($response);
        }

        return new UserCardResource($card);
    }
}
