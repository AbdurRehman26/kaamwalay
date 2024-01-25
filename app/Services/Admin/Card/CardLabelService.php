<?php

namespace App\Services\Admin\Card;

use App\Models\CardLabel;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItemStatus;
use App\Models\UserCard;
use App\Services\Admin\Order\OrderLabelService;
use App\Services\Admin\V2\OrderService;
use App\Services\AGS\AgsService;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class CardLabelService
{
    public function __construct(
        protected AgsService $agsService,
        protected CreateCardLabelService $createCardLabelService,
        protected OrderLabelService $orderLabelService,
        protected OrderService $orderService,
    ) {
    }

    public function getOrCreateCardProductLabel(CardProduct $cardProduct): CardLabel
    {
        if ($cardProduct->cardLabel()->exists()) {
            return $cardProduct->cardLabel;
        }

        return $this->createCardLabelService->createLabel($cardProduct);
    }

    public function updateCardLabel(CardLabel $cardLabel, array $data): CardLabel
    {
        if (empty($data['line_three'])) {
            $data['line_three'] = '';
        }

        if (empty($data['line_four'])) {
            $data['line_four'] = '';
        }

        $cardLabel->update($data);

        return $cardLabel->fresh();
    }

    public function updateAndExportLabels(Order $order, array $data): string
    {
        $exportLabels = [];

        $certificateNumbers = Arr::pluck($data, 'certificate_number');
        $userCards = UserCard::whereIn('certificate_number', $certificateNumbers)->with('orderItem.cardProduct.cardLabel')->get();

        foreach ($data as $certificateData) {
            $userCard = $userCards->where('certificate_number', $certificateData['certificate_number'])->first();
            $cardLabel = $userCard->orderItem->cardProduct->cardLabel;

            if ($certificateData['persist_changes']) {
                $cardLabel->line_one = $certificateData['line_one'];
                $cardLabel->line_two = $certificateData['line_two'];
                $cardLabel->line_three = $certificateData['line_three'] ?? '';
                $cardLabel->line_four = $certificateData['line_four'] ?? '';
                $cardLabel->save();
            }

            $exportLabels[] = [
                'label_line_one' => $certificateData['line_one'],
                'label_line_two' => $certificateData['line_two'],
                'label_line_three' => $certificateData['line_three'] ?? '',
                'label_line_four' => $certificateData['line_four'] ?? '',
                'card_number' => $certificateData['line_four'] ?? '',
                'certificate_id' => $userCard->certificate_number,
                'final_grade' => $userCard->overall_grade,
                'grade_nickname' => $userCard->overall_grade_nickname,
            ];
        }

        return $this->orderLabelService->generateFileUploadToCloudAndSaveLabel($order, $exportLabels);
    }

    /**
     * @return Collection<int, UserCard>
     */
    public function getOrderLabels(Order $order): Collection
    {
        $orderCards = $this->orderService->getCardsByStatus($order, OrderItemStatus::GRADED, [
            'orderItem.cardProduct.cardLabel',
            'orderItem.cardProduct.cardCategory.cardCategoryType',
            'orderItem.cardProduct.cardSet.cardSeries',
        ]);

        $cardsWithoutLabel = $orderCards->filter(function (UserCard $card, $key) {
            return empty($card->orderItem->cardProduct->cardLabel);
        })->unique(function (UserCard $card) {
            return $card->orderItem->card_product_id;
        });

        foreach ($cardsWithoutLabel as $card) {
            $this->createCardLabelService->createLabel($card->orderItem->cardProduct);

            // Since label was lazy loaded above and new label has been created now,
            // We need to reload card product to use label in API resource response
            $card->orderItem->cardProduct->refresh();
        }

        return $orderCards;
    }
}
