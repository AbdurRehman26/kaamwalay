<?php

namespace App\Services\Order;

use App\Http\Filters\UserCardSearchFilter;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\User;
use App\Models\UserCard;
use App\Models\UserCardCertificate;
use App\Services\Admin\CardGradingService;
use App\Services\AGS\AgsService;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class UserCardService
{
    public function createItemUserCard(OrderItem $item): UserCard
    {
        $cardGradingService = new CardGradingService;
        $userCard = new UserCard();
        $userCard->order_item_id = $item->id;
        $userCard->user_id = $item->order->user_id;
        $userCard->human_grade_values = $cardGradingService->defaultValues('human');
        $userCard->robo_grade_values = $cardGradingService->defaultValues('robo');
        $userCard->overall_values = $cardGradingService->defaultValues('overall');
        $userCard->overall_grade = 0.0;
        $userCard->generated_images = $cardGradingService->defaultValues('images');
        $userCard->save();

        $this->createCertificate($userCard);

        return $userCard->fresh();
    }

    public function createCertificate(UserCard $userCard): UserCardCertificate
    {
        $certificate = new UserCardCertificate();
        $certificate->user_card_id = $userCard->id;
        $certificate->save();

        $certificateNumber = Str::padLeft((string) $certificate->id, 8, '0');
        $certificate->number = $certificateNumber;
        $certificate->save();

        $userCard->certificate_number = $certificateNumber;
        $userCard->save();

        return $certificate;
    }

    public function getFeedCards(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        return UserCard::with(['orderItem.cardProduct.cardSet.cardSeries', 'orderItem.cardProduct.cardCategory', 'user'])
        ->join('order_items', 'order_items.id', '=', 'user_cards.order_item_id')
        ->join('orders', 'orders.id', '=', 'order_items.order_id')
        ->join('order_item_status_histories', 'order_item_status_histories.order_item_id', '=', 'order_items.id')
        ->whereIn('order_item_status_histories.order_item_status_id', [OrderItemStatus::GRADED])
        ->whereIn('orders.order_status_id', [OrderStatus::SHIPPED])
        ->whereIn('order_items.order_item_status_id', [OrderItemStatus::GRADED])
        ->select(['user_cards.*','order_item_status_histories.created_at as graded_at'])
        ->orderBy('graded_at', 'desc')
        ->paginate($itemsPerPage);
    }

    public function getCustomerCards(User $user): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        $query = UserCard::with(['orderItem.cardProduct.cardSet.cardSeries', 'orderItem.cardProduct.cardCategory'])
        ->join('order_items', 'order_items.id', '=', 'user_cards.order_item_id')
        ->join('orders', 'orders.id', '=', 'order_items.order_id')
        ->join('card_products', 'card_products.id', '=', 'order_items.card_product_id')
        ->join('order_item_status_histories', 'order_item_status_histories.order_item_id', '=', 'order_items.id')
        ->where('user_cards.user_id', $user->id)
        ->where('order_item_status_histories.order_item_status_id', OrderItemStatus::GRADED)
        ->whereIn('orders.order_status_id', [OrderStatus::SHIPPED])
        ->where('order_items.order_item_status_id', OrderItemStatus::GRADED)
        ->select(['user_cards.*']);

        return QueryBuilder::for($query)
        ->allowedFilters([
            AllowedFilter::custom('search', new UserCardSearchFilter),
        ])
        ->allowedSorts([
            AllowedSort::field('name', 'card_products.name'),
            AllowedSort::field('date', 'order_item_status_histories.created_at'),
        ])
        ->defaultSort('-order_item_status_histories.created_at')
        ->paginate($itemsPerPage);
    }

    public function getDataForPublicCardPage(string $certificateId): array
    {
        $userCard = UserCard::where('certificate_number', $certificateId)->first();

        if (empty($userCard) || $userCard->orderItem->order->order_status_id !== OrderStatus::SHIPPED) {
            return [
                'grades_available' => false,
            ];
        }

        return [
            'grades_available' => true,
            'is_fake' => $userCard->is_fake,
            'certificate_id' => $userCard->certificate_number,
            'grade' => $this->prepareGradeForPublicCardPage($userCard),
            'card' => [
                'name' => $userCard->orderItem->cardProduct->name,
                'full_name' => $userCard->orderItem->cardProduct->getSearchableName(),
                'image_path' => $userCard->orderItem->cardProduct->image_path,
                'type' => $userCard->orderItem->cardProduct->cardCategory->name,
                'series' => $userCard->orderItem->cardProduct->cardSet->cardSeries->name,
                'set' => $userCard->orderItem->cardProduct->cardSet->name,
                'release_date' => ! empty($userCard->orderItem->cardProduct->cardSet->release_date) ?
                    Carbon::parse($userCard->orderItem->cardProduct->cardSet->release_date)->format('F d, Y') :
                    null,
                'number' => $userCard->orderItem->cardProduct->card_number_order ?? null,
            ],
            'overall' => $this->prepareOverallGradesForPublicCardPage($userCard),
            'front_scan' => $this->prepareFrontScanGradesForPublicCardPage($userCard),
            'back_scan' => $this->prepareBackScanGradesForPublicCardPage($userCard),
            'generated_images' => resolve(AgsService::class)->getScannedImagesByCertificateId($certificateId),
        ];
    }

    protected function prepareGradeForPublicCardPage(UserCard $userCard): array
    {
        return [
            'grade' => $this->preparePreciseValue($userCard->overall_grade),
            'nickname' => $userCard->overall_grade_nickname,
        ];
    }

    protected function prepareOverallGradesForPublicCardPage(UserCard $userCard): array
    {
        return [
            'centering' => $this->preparePreciseValue($userCard->overall_values['center']),
            'surface' => $this->preparePreciseValue($userCard->overall_values['surface']),
            'edges' => $this->preparePreciseValue($userCard->overall_values['edge']),
            'corners' => $this->preparePreciseValue($userCard->overall_values['corner']),
        ];
    }

    /**
     * It returns precise value for display.
     * e.g. 8.00 will be converted to 8, 8.50 will be converted to 8.5, 8.125 will be converted to 8.1
     *
     * @param  float  $gradeValue
     * @return float
     */
    protected function preparePreciseValue(float $gradeValue): float
    {
        if (floor($gradeValue) === $gradeValue) {
            return floor($gradeValue);
        } else {
            return round($gradeValue, 1);
        }
    }

    protected function prepareFrontScanGradesForPublicCardPage(UserCard $userCard): array
    {
        return [
            'centering' => number_format((float) $userCard->human_grade_values['front']['center'], 2),
            'surface' => number_format((float) $userCard->human_grade_values['front']['surface'], 2),
            'edges' => number_format((float) $userCard->human_grade_values['front']['edge'], 2),
            'corners' => number_format((float) $userCard->human_grade_values['front']['corner'], 2),
        ];
    }

    protected function prepareBackScanGradesForPublicCardPage(UserCard $userCard): array
    {
        return [
            'centering' => number_format((float) $userCard->human_grade_values['back']['center'], 2),
            'surface' => number_format((float) $userCard->human_grade_values['back']['surface'], 2),
            'edges' => number_format((float) $userCard->human_grade_values['back']['edge'], 2),
            'corners' => number_format((float) $userCard->human_grade_values['back']['corner'], 2),
        ];
    }

    protected function prepareGeneratedImagesForPublicCardPage(UserCard $userCard): array
    {
        return array_filter($userCard->generated_images, function (array $imageData) {
            return $imageData['output_image'] !== null;
        });
    }
}
