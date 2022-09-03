<?php

namespace App\Services\Admin\Card;

use App\Models\CardLabel;
use App\Models\CardProduct;
use App\Models\Order;
use App\Models\UserCard;
use App\Services\Admin\Order\OrderLabelService;
use App\Services\AGS\AgsService;
use Illuminate\Support\Collection;

class CardLabelService
{
    public function __construct(
        protected AgsService $agsService,
        protected CreateCardLabelService $createCardLabelService,
        protected OrderLabelService $orderLabelService
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
        $cardLabel->update($data);

        return $cardLabel->fresh();
    }


    public function updateAndExportLabels(Order $order, array $data): string
    {
        $exportLabels = [];

        foreach ($data as $certificateData) {
            $userCard = UserCard::whereCertificateNumber($certificateData['certificate_number'])->first();
            $orderItem = $userCard->orderItem;
            $cardLabel = $orderItem->cardProduct->cardLabel;

            if ($certificateData['persist_changes']) {
                $cardLabel->line_one = $certificateData['line_one'];
                $cardLabel->line_two = $certificateData['line_two'];
                $cardLabel->line_three = $certificateData['line_three'];
                $cardLabel->line_four = $certificateData['line_four'];
                $cardLabel->save();
            }

            $exportLabels[] = [
                'label_line_one' => $certificateData['line_one'],
                'label_line_two' => $certificateData['line_two'],
                'label_line_three' => $certificateData['line_three'],
                'label_line_four' => $certificateData['line_four'],
                'card_number' => $certificateData['line_four'],
                'order_id' => $orderItem->order_id,
                'card_reference_id' => $orderItem->cardProduct->card_reference_id,
                'certificate_id' => $orderItem->userCard->certificate_number,
                'final_grade' => $orderItem->userCard->overall_grade,
                'grade_nickname' => $orderItem->userCard->overall_grade_nickname,
            ];
        }

        $fileUrl = $this->orderLabelService->generateFileAndUploadToCloud($order, $exportLabels);
        $this->orderLabelService->saveCardLabel($order, $fileUrl);

        return $fileUrl;
    }

    public function getOrderLabels(Order $order): Collection
    {
        $orderCards = $this->orderLabelService->getOrderGradedCards($order);

        $cardsWithoutLabel = $orderCards->filter(function ($card, $key) {
            return $card->orderItem->cardProduct->cardLabel()->doesntExist();
        });

        foreach ($cardsWithoutLabel as $card) {
            $this->createCardLabelService->createLabel($card->orderItem->cardProduct);
        }

        return $orderCards;
    }
}
