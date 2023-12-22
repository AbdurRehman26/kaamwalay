<?php

namespace App\Services\Order;

use App\Http\Filters\UserCardSearchFilter;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\PopReportsCard;
use App\Models\User;
use App\Models\UserCard;
use App\Models\UserCardCertificate;
use App\Services\Admin\CardGradingService;
use App\Services\AGS\AgsService;
use App\Services\SocialPreviewLambdaService;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class UserCardService
{
    protected const DEFAULT_PAGE_SIZE = 10;

    public function __construct(protected AgsService $agsService)
    {
    }

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

    /**
     * @return LengthAwarePaginator<UserCard>
     */
    public function getFeedCards(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page');

        return UserCard::with([
            'orderItem.cardProduct.cardSet.cardSeries', 'orderItem.cardProduct.cardCategory', 'user',
        ])
            ->join('order_items', 'order_items.id', '=', 'user_cards.order_item_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('order_item_status_histories', 'order_item_status_histories.order_item_id', '=', 'order_items.id')
            ->whereIn('order_item_status_histories.order_item_status_id', [OrderItemStatus::GRADED])
            ->whereIn('orders.order_status_id', [OrderStatus::SHIPPED])
            ->whereIn('order_items.order_item_status_id', [OrderItemStatus::GRADED])
            ->select(['user_cards.*', 'order_item_status_histories.created_at as graded_at'])
            ->orderBy('graded_at', 'desc')
            ->paginate($itemsPerPage);
    }

    // @phpstan-ignore-next-line
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

        $data = $this->agsService->getGradesByCertificateId($certificateId);

        $generatedImages = $this->pepareScannedImagesForPublicCardPage($data);

        return [
            'grades_available' => true,
            'is_fake' => $userCard->is_fake,
            'certificate_id' => $userCard->certificate_number,
            'grade' => $this->prepareGradeForPublicCardPage($userCard),
            'owner' => $userCard->user->username,
            'card' => [
                'name' => $userCard->orderItem->cardProduct->name,
                'full_name' => $userCard->orderItem->cardProduct->getSearchableName(),
                'image_path' => $userCard->orderItem->cardProduct->image_path,
                'type' => $userCard->orderItem->cardProduct->cardCategory->name,
                'series' => $userCard->orderItem->cardProduct->cardSet->cardSeries->name,
                'set' => $userCard->orderItem->cardProduct->cardSet->name,
                'release_date' => !empty($userCard->orderItem->cardProduct->cardSet->release_date) ?
                    Carbon::parse($userCard->orderItem->cardProduct->cardSet->release_date)->format('F d, Y') :
                    null,
                'number' => $userCard->orderItem->cardProduct->card_number_order ?? null,
            ],
            'overall' => $this->prepareOverallGradesForPublicCardPage($userCard),
            'front_scan' => $this->prepareFrontScanGradesForPublicCardPage($userCard),
            'back_scan' => $this->prepareBackScanGradesForPublicCardPage($userCard),
            'generated_images' => $generatedImages,
            'generated_images_front_available' => array_key_exists('front', $generatedImages),
            'generated_images_back_available' => array_key_exists('back', $generatedImages),
            'slabbed_images' => $this->prepareSlabbedImagesForPublicCardPage($data, $userCard),
            'social_images' => $userCard->social_images,
            'page_url' => $this->getPageUrl($certificateId),
            'pop_data' => $this->getAgsPopulationData($userCard),
        ];
    }

    public function pepareScannedImagesForPublicCardPage(array $data): array
    {
        if (
            empty($data) ||
            $data['count'] === 0 ||
            (
                empty($data['results'][0]['laser_front_scan']) &&
                empty($data['results'][0]['laser_back_scan']) &&
                empty($data['results'][0]['front_scan']) &&
                empty($data['results'][0]['back_scan'])
            )
        ) {
            return [];
        }

        return $this->prepareGeneratedImagesForPublicPage($data['results'][0]);
    }

    protected function prepareGeneratedImagesForPublicPage(array $data): array
    {
        $front = [
            [
                'output_image' => $data['laser_front_scan']['centering_result']['output_image'] ?? null,
                'name' => 'Centering',
            ],
            [
                'output_image' => $data['laser_front_scan']['surface_result']['output_image'] ?? null,
                'name' => 'Surface',
            ],
            [
                'output_image' => $data['laser_front_scan']['edges_result']['output_image'] ?? null,
                'name' => 'Edges',
            ],
            [
                'output_image' => $data['laser_front_scan']['corners_result']['output_image'] ?? null,
                'name' => 'Corners',
            ],
        ];
        $back = [
            [
                'output_image' => $data['laser_back_scan']['centering_result']['output_image'] ?? null,
                'name' => 'Centering',
            ],
            [
                'output_image' => $data['laser_back_scan']['surface_result']['output_image'] ?? null,
                'name' => 'Surface',
            ],
            [
                'output_image' => $data['laser_back_scan']['edges_result']['output_image'] ?? null,
                'name' => 'Edges',
            ],
            [
                'output_image' => $data['laser_back_scan']['corners_result']['output_image'] ?? null,
                'name' => 'Corners',
            ],
        ];

        $newFront = array_filter($front, function (array $imageData) {
            return $imageData['output_image'] !== null;
        });

        $newBack = array_filter($back, function (array $imageData) {
            return $imageData['output_image'] !== null;
        });

        $imagesData = [
            'front' => $newFront,
            'back' => $newBack,
        ];

        return array_filter($imagesData, function (array $imageData) {
            return count($imageData) > 0;
        });
    }

    protected function prepareSlabbedImagesForPublicCardPage(array $data, UserCard $userCard): array
    {
        if (
            !empty($data['results'][0]['front_slab_image']) &&
            !empty($data['results'][0]['back_slab_image'])
        ) {
            return [
                'front_slab_image' => $data['results'][0]['front_slab_image'],
                'back_slab_image' => $data['results'][0]['back_slab_image'],
            ];
        }

        return [
            'image_path' => $userCard->orderItem->cardProduct->image_path ?? null,
        ];
    }

    protected function getAgsPopulationData(UserCard $userCard): array
    {
        $popData = PopReportsCard::where('card_product_id', $userCard->orderItem->card_product_id)->first();
        $gradeName = $this->prepareGradeForPublicCardPage($userCard);
        $gradeNickName = $this->convertGradeNicknameToColumn($gradeName['nickname'] ?? '');

        $data = [];
        if ($popData) {
            $data = [
                'PR' => $popData->pr,
                'FR' => $popData->fr,
                'GOOD' => $popData->good,
                'GOOD+' => $popData->good_plus,
                'VG' => $popData->vg,
                'VG+' => $popData->vg_plus,
                'VG-EX' => $popData->vg_ex,
                'VG-EX+' => $popData->vg_ex_plus,
                'EX' => $popData->ex,
                'EX+' => $popData->ex_plus,
                'EX-MT' => $popData->ex_mt,
                'EX-MT+' => $popData->ex_mt_plus,
                'NM' => $popData->nm,
                'NM+' => $popData->nm_plus,
                'NM-MT' => $popData->nm_mt,
                'NM-MT+' => $popData->nm_mt_plus,
                'MINT' => $popData->mint,
                'MINT+' => $popData->mint_plus,
                'GEM-MT' => $popData->gem_mt,
                'totalPop' => $popData->total + $popData->total_plus,
                'totalPopForCurrentCard' => $popData->$gradeNickName,
            ];
        }

        return $data;
    }

    protected function convertGradeNicknameToColumn(string $nickname): string
    {
        return Str::lower(Str::replace('-', '_', Str::replace('+', '_plus', $nickname)));
    }

    protected function getPageUrl(string $certificateId): string
    {
        return route('feed.view', $certificateId);
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
     */
    protected function preparePreciseValue(float $gradeValue): float
    {
        if ($gradeValue === floor($gradeValue)) {
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

    // @phpstan-ignore-next-line
    public function getCertificates(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?? self::DEFAULT_PAGE_SIZE;

        $query = UserCard::join('order_items', 'order_items.id', '=', 'user_cards.order_item_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.order_status_id', OrderStatus::SHIPPED)
            ->where('order_items.order_item_status_id', OrderItemStatus::GRADED)
            ->select(['user_cards.*']);

        return QueryBuilder::for($query)
            ->allowedSorts(['created_at'])
            ->defaultSort('-user_cards.created_at')
            ->paginate($itemsPerPage);
    }

    public function getCertificate(string $certificateNumber): Model|QueryBuilder
    {
        $query = UserCard::where('certificate_number', $certificateNumber);

        return QueryBuilder::for($query)
            ->firstOrFail();
    }

    public function generateSocialPreview(UserCard $userCard): void
    {
        $uid = Str::uuid();
        $certificateNumber = $userCard->certificate_number;
        $overallGrade = $this->prepareGradeForPublicCardPage($userCard);
        $viewData = [
            'card_name' => $userCard->orderItem->cardProduct->name,
            'card_image' => $userCard->orderItem->cardProduct->image_path,
            'overall_grade' => $overallGrade['grade'],
            'overall_grade_nickname' => $overallGrade['nickname'],
        ];

        $socialPreviewLambdaService = new SocialPreviewLambdaService();

        // For Facebook, Twitter, Instagram Post
        $squareImageUrl = $socialPreviewLambdaService->generateFromView(
            'social.card',
            $viewData,
            'jpeg',
            100,
            700,
            700,
            "social-previews/user-cards/$certificateNumber-square-$uid.jpg"
        );

        // For Instagram Story
        $verticalImageUrl = $socialPreviewLambdaService->generateFromView(
            'social.card',
            $viewData,
            'jpeg',
            100,
            420,
            800,
            "social-previews/user-cards/$certificateNumber-vertical-$uid.jpg"
        );

        UserCard::withoutSyncingToSearch(function () use ($userCard, $squareImageUrl, $verticalImageUrl) {
            $userCard->social_images = [
                'square' => $squareImageUrl,
                'vertical' => $verticalImageUrl,
            ];
            $userCard->save();
        });
    }
}
