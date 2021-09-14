<?php

namespace App\Services\Admin\Order;

use App\Events\API\Admin\Order\OrderUpdated;
use App\Exceptions\API\Admin\Order\OrderItem\OrderItemDoesNotBelongToOrder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\UserCard;
use App\Models\UserCardCertificate;
use App\Services\AGS\AgsService;

class ManageOrderService
{
    public function __construct(protected AgsService $agsService)
    {
    }

    public function confirmReview(Order $order, User $user): Order
    {
        $order->order_status_id = 3;
        $order->reviewed_by_id = $user->id;
        $order->reviewed_at = new \Datetime();
        $order->save();

        $this->createCertificates($order);

        return $order;
    }

    public function createCertificates(Order $order)
    {
        $certificateIds = implode(',', $this->getOrderCertificates($order));

        return $this->agsService->createCertificates($certificateIds);
    }

    public function addExtraCard(Order $order, int $card_id, float $value): OrderItem
    {
        $newItem = OrderItem::create([
            'order_id' => $order->id,
            'card_product_id' => $card_id,
            'quantity' => 1,
            'declared_value_per_unit' => $value,
            'declared_value_total' => $value,
        ]);

        return (new OrderItemService)->changeStatus($order, $newItem, ["status" => "confirmed"]);
    }

    public function editCard(Order $order, OrderItem $orderItem, int $card_id, float $value): OrderItem
    {
        if ($orderItem->order_id !== $order->id) {
            throw new OrderItemDoesNotBelongToOrder;
        }

        $orderItem->card_product_id = $card_id;
        $orderItem->declared_value_per_unit = $value;
        $orderItem->declared_value_total = $value;
        $orderItem->save();

        return $orderItem;
    }

    public function updateNotes(Order $order, $notes): Order
    {
        $order->notes = $notes;
        $order->save();

        OrderUpdated::dispatch($order);

        return $order;
    }

    protected function getOrderCertificates($order): array
    {
        $certificates = UserCardCertificate::select('number')
        ->join('user_cards', 'user_card_certificates.user_card_id', '=', 'user_cards.id')
        ->join('order_items', 'user_cards.order_item_id', '=', 'order_items.id')
        ->where('order_items.order_id', $order->id)->get();

        return $certificates->pluck('number')->flatten()->all();
    }

    public function getGrades(Order $order)
    {
        $grades = $this->agsService->getGrades($this->getOrderCertificates($order));

        $data = $this->updateLocalGrades($grades);

        return $data;
    }

    protected function updateLocalGrades(array $grades): array
    {
        $cards = [];
        foreach ($grades['results'] as $result) {
            $card = UserCard::whereCertificateNumber($result['certificate_id'])->first();
            $card->update($this->getAgsGradesStructure($result));

            $cards[] = $card;
        }

        return $cards;
    }

    protected function getAgsGradesStructure(array $gradesResult): array
    {
        return [
            'grading_id' => $gradesResult['id'],
            'robo_grade_values' => [
                'front' => ! is_null($gradesResult['front_scan']) ? [
                    'center' => $gradesResult['front_scan']['centering_grade']['grade'],
                    'surface' => $gradesResult['front_scan']['surface_grade']['grade'],
                    'edge' => $gradesResult['front_scan']['edges_grade']['grade'],
                    'corner' => $gradesResult['front_scan']['corners_grade']['grade'],
                ] : null,
                'back' => ! is_null($gradesResult['back_scan']) ? [
                    'center' => $gradesResult['back_scan']['centering_grade']['grade'],
                    'surface' => $gradesResult['back_scan']['surface_grade']['grade'],
                    'edge' => $gradesResult['back_scan']['edges_grade']['grade'],
                    'corner' => $gradesResult['back_scan']['corners_grade']['grade'],
                ] : null,
            ],
            'generated_images' => [
                [
                    'output_image' => ! is_null($gradesResult['front_scan']) ? $gradesResult['front_scan']['centering_result']['output_image'] : null,
                    'name' => 'Front Centering',
                ],
                [
                    'output_image' => ! is_null($gradesResult['front_scan']) ? $gradesResult['front_scan']['surface_result']['output_image'] : null,
                    'name' => 'Front Surface',
                ],
                [
                    'output_image' => ! is_null($gradesResult['front_scan']) ? $gradesResult['front_scan']['edges_result']['output_image'] : null,
                    'name' => 'Front Edges',
                ],
                [
                    'output_image' => ! is_null($gradesResult['front_scan']) ? $gradesResult['front_scan']['corners_result']['output_image'] : null,
                    'name' => 'Front Corners',
                ],
                [
                    'output_image' => ! is_null($gradesResult['back_scan']) ? $gradesResult['back_scan']['centering_result']['output_image'] : null,
                    'name' => 'Back Centering',
                ],
                [
                    'output_image' => ! is_null($gradesResult['back_scan']) ? $gradesResult['back_scan']['surface_result']['output_image'] : null,
                    'name' => 'Back Surface',
                ],
                [
                    'output_image' => ! is_null($gradesResult['back_scan']) ? $gradesResult['back_scan']['edges_result']['output_image'] : null,
                    'name' => 'Back Edges',
                ],
                [
                    'output_image' => ! is_null($gradesResult['back_scan']) ? $gradesResult['back_scan']['corners_result']['output_image'] : null,
                    'name' => 'Back Corners',
                ],
            ],
        ];
    }
}
