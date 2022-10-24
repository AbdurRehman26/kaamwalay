<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Events\API\Admin\Order\OrderUpdated;
use App\Events\API\Admin\UserCard\UserCardGradeRevisedEvent;
use App\Exceptions\Services\Admin\CardGradeIsInvalid;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Order\Grades\UserCardGradeRequest;
use App\Http\Resources\API\V2\Admin\Order\UserCardResource as OrderUserCardResource;
use App\Http\Resources\API\V2\Admin\UserCard\UserCardCollection;
use App\Http\Resources\API\V2\Admin\UserCard\UserCardResource;
use App\Jobs\Admin\Order\UpdateHumanGradesInAgs;
use App\Models\Order;
use App\Models\UserCard;
use App\Services\Admin\CardGradingService;
use App\Services\Order\UserCardService;

class UserCardController extends Controller
{
    public function __construct(
        protected UserCardService $userCardService
    ) {
    }

    public function listCertificates(): UserCardCollection
    {
        $certificates = $this->userCardService->getCertificates();

        return new UserCardCollection($certificates);
    }

    public function getCertificate(string $certificateNumber): UserCardResource
    {
        $certificate = $this->userCardService->getCertificate($certificateNumber);

        return new UserCardResource($certificate);
    }

    /**
     * @throws CardGradeIsInvalid
     */
    public function updateGradingValues(
        UserCardGradeRequest $request,
        Order $order,
        UserCard $card,
        CardGradingService $cardGradingService,
    ): OrderUserCardResource {
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
            $card->orderItem->isGraded() && $card->orderItem->hasOrderGradedOrShipped(),
            $card
        );

        return new OrderUserCardResource($card);
    }
}
