<?php

namespace App\Services\PopReport;

use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\Order;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\PopReportsCard;
use App\Models\PopReportsSeries;
use App\Models\PopReportsSet;
use App\Models\UserCard;
use App\Services\Admin\CardGradingService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\QueryBuilder;

class PopReportService
{
    protected array $reportsTableArray = ['total' => 0, 'total_plus' => 0];

    protected const PER_PAGE = 100;

    public function __construct()
    {
        $this->generateReportEmptyArray();
    }

    public function initializePopReportsForAll(): void
    {
        $this->initializePopReportsForCardSeries();
        $this->initializePopReportsForCardSets();
        $this->initializePopReportsForCards();
    }

    public function initializePopReportsForCardSeries(): void
    {
        $cardSeries = CardSeries::all();

        foreach ($cardSeries as $cardSeriesItem) {
            $this->initializeSeriesPopReport($cardSeriesItem);
        }
    }

    public function initializePopReportsForCardSets(): void
    {
        $cardSets = CardSet::all();

        foreach ($cardSets as $cardSet) {
            $this->initializeSetPopReport($cardSet);
        }
    }

    public function initializePopReportsForCards(): void
    {
        $cardProducts = CardProduct::canBeInitializedInPopReport()->where(function ($query) {
            $this->isCardInformationComplete($query);
        })->select('card_products.*')->get();

        foreach ($cardProducts as $cardProduct) {
            $this->initializeCardPopReport($cardProduct);
        }
    }

    public function initializeCardPopReport(CardProduct $cardProduct): PopReportsCard
    {
        return PopReportsCard::firstOrCreate([
            'card_product_id' => $cardProduct->id,
            'card_set_id' => $cardProduct->card_set_id,
        ]);
    }

    public function deleteCardPopReport(CardProduct $cardProduct): void
    {
        PopReportsCard::where('card_product_id', $cardProduct->id)->delete();
    }

    public function initializeSeriesPopReport(CardSeries $cardSeries): PopReportsSeries
    {
        return PopReportsSeries::firstOrCreate([
            'card_series_id' => $cardSeries->id,
        ]);
    }

    public function initializeSetPopReport(CardSet $cardSet): PopReportsSet
    {
        return PopReportsSet::firstOrCreate([
            'card_set_id' => $cardSet->id,
            'card_series_id' => $cardSet->card_series_id,
        ]);
    }

    public function updateAllSeriesReport(): void
    {
        $allCardSeries = CardSeries::all();

        foreach ($allCardSeries as $cardSeries) {
            $this->info('Updating reports for card series '.$cardSeries->id);

            $this->updateSeriesReport($cardSeries);

            $this->info('Updating reports for card series '.$cardSeries->id.' completed');
        }
    }

    public function updateSeriesReport(CardSeries $cardSeries): void
    {
        $userCards = UserCard::join('order_items', 'user_cards.order_item_id', 'order_items.id')
            ->join('card_products', 'order_items.card_product_id', 'card_products.id')
            ->join('card_sets', 'card_products.card_set_id', 'card_sets.id')
            ->join('orders', 'order_items.order_id', 'orders.id')
            ->where(function ($query) {
                $this->isCardInformationComplete($query);
            })
            ->where('card_sets.card_series_id', $cardSeries->id)
            ->where('user_cards.overall_grade', '>', 0)
            ->where('order_items.order_item_status_id', [OrderItemStatus::GRADED])
            ->whereIn('orders.order_status_id', [OrderStatus::GRADED, OrderStatus::SHIPPED])
            ->select('user_cards.overall_grade', 'card_sets.card_series_id as card_series_id')
            ->get();

        $whereCondition = ['card_series_id' => $cardSeries->id];
        $popSeriesReportModel = PopReportsSeries::firstOrCreate($whereCondition);

        $reportsTableArray = $this->accumulateReportRow($userCards);

        $popSeriesReportModel->where($whereCondition)->update($reportsTableArray);
    }

    public function updateAllSetsReport(): void
    {
        $cardSets = CardSet::join('card_products', 'card_products.card_set_id', '=', 'card_sets.id')
            ->join('order_items', 'order_items.card_product_id', '=', 'card_products.id')
            ->join('user_cards', 'user_cards.order_item_id', '=', 'order_items.id')
            ->where(function ($query) {
                $this->isCardInformationComplete($query);
            })
            ->groupBy('card_sets.id')
            ->select('card_sets.*')
            ->get();

        $this->info('Total sets to be processed: '.count($cardSets));

        foreach ($cardSets as $cardSet) {
            $this->info('Updating reports for card sets '.$cardSet->id);

            $this->updateSetsReport($cardSet);

            $this->info('Updating reports for card sets '.$cardSet->id.' completed');
        }
    }

    public function updateSetsReport(CardSet $cardSet): void
    {
        $userCards = UserCard::join('order_items', 'user_cards.order_item_id', 'order_items.id')
            ->join('card_products', 'order_items.card_product_id', 'card_products.id')
            ->join('orders', 'order_items.order_id', 'orders.id')
            ->where('card_products.card_set_id', $cardSet->id)
            ->where(function ($query) {
                $this->isCardInformationComplete($query);
            })
            ->where('user_cards.overall_grade', '>', 0)
            ->where('order_items.order_item_status_id', [OrderItemStatus::GRADED])
            ->whereIn('orders.order_status_id', [OrderStatus::GRADED, OrderStatus::SHIPPED])
            ->select('user_cards.overall_grade')
            ->get();

        $whereCondition = ['card_set_id' => $cardSet->id, 'card_series_id' => $cardSet->card_series_id];

        $popSetReportModel = PopReportsSet::firstOrCreate($whereCondition);

        $reportsTableArray = $this->accumulateReportRow($userCards);

        $popSetReportModel->where($whereCondition)->update($reportsTableArray);
    }

    public function updateAllCardProductsReport(): void
    {
        $cardProducts = CardProduct::join('order_items', 'order_items.card_product_id', '=', 'card_products.id')
            ->join('user_cards', 'user_cards.order_item_id', '=', 'order_items.id')
            ->groupBy('card_products.id')
            ->select('card_products.*')
            ->where(function ($query) {
                $this->isCardInformationComplete($query);
            })
            ->get();

        $this->info('Total cards to be processed: '.count($cardProducts));

        $this->updateMultipleCardProductsReports($cardProducts);
    }

    public function updateCardProductsReport(CardProduct $cardProduct)
    {
        $userCards = UserCard::join('order_items', 'user_cards.order_item_id', 'order_items.id')
            ->join('card_products', 'order_items.card_product_id', 'card_products.id')
            ->join('orders', 'order_items.order_id', 'orders.id')
            ->where(function ($query) {
                $this->isCardInformationComplete($query);
            })
            ->where('card_products.id', $cardProduct->id)
            ->where('user_cards.overall_grade', '>', 0)
            ->where('order_items.order_item_status_id', [OrderItemStatus::GRADED])
            ->whereIn('orders.order_status_id', [OrderStatus::GRADED, OrderStatus::SHIPPED])
            ->select('user_cards.overall_grade', 'card_products.card_set_id as card_set_id')
            ->get();

        $whereCondition = ['card_product_id' => $cardProduct->id, 'card_set_id' => $cardProduct->card_set_id];
        $popCardReportModel = PopReportsCard::firstOrCreate($whereCondition);

        $reportsTableArray = $this->accumulateReportRow($userCards);

        $popCardReportModel->where($whereCondition)->update($reportsTableArray);
    }

    public function updateMultipleSeriesReports(Collection $cardSeries): void
    {
        $cardSeries->each(function (CardSeries $series) {
            $this->updateSeriesReport($series);
        });
    }

    public function updateMultipleSetsReports(Collection $cardSets): void
    {
        $cardSets->each(function (CardSet $cardSet) {
            $this->updateSetsReport($cardSet);
        });
    }

    public function updateMultipleCardProductsReports(Collection $cardProducts): void
    {
        $cardProducts->each(function (CardProduct $cardProduct) {
            $this->updateCardProductsReport($cardProduct);
        });
    }

    public function updatePopReportsForOrder(Order $order): void
    {
        $orderCards = CardProduct::join('order_items', 'order_items.card_product_id', '=', 'card_products.id')
            ->where('order_items.order_id', $order->id)
            ->where(function ($query) {
                $this->isCardInformationComplete($query);
            })
            ->select('card_products.*')
            ->get();

        $orderSets = CardSet::join('card_products', 'card_products.card_set_id', '=', 'card_sets.id')
            ->join('order_items', 'order_items.card_product_id', '=', 'card_products.id')
            ->where(function ($query) {
                $this->isCardInformationComplete($query);
            })
            ->where('order_items.order_id', $order->id)
            ->select('card_sets.*')
            ->groupBy('card_sets.id')
            ->get();

        $orderSeries = CardSeries::join('card_sets', 'card_sets.card_series_id', '=', 'card_series.id')
            ->join('card_products', 'card_products.card_set_id', '=', 'card_sets.id')
            ->join('order_items', 'order_items.card_product_id', '=', 'card_products.id')
            ->where(function ($query) {
                $this->isCardInformationComplete($query);
            })
            ->where('order_items.order_id', $order->id)
            ->select('card_series.*')
            ->groupBy('card_series.id')
            ->get();

        $this->updateMultipleCardProductsReports($orderCards);
        $this->updateMultipleSetsReports($orderSets);
        $this->updateMultipleSeriesReports($orderSeries);
    }

    // @phpstan-ignore-next-line
    public function getSeriesReport(CardCategory $cardCategory): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?: self::PER_PAGE;

        $query = PopReportsSeries::join('card_series', 'pop_reports_series.card_series_id', 'card_series.id')
            ->where('card_series.card_category_id', $cardCategory->id)
            ->select('*')
            ->addSelect(DB::raw('(total + total_plus) as total_graded'));

        return QueryBuilder::for($query)
            ->allowedSorts(['card_series_id', 'total_graded'])
            ->defaultSort('-total_graded')
            ->paginate($itemsPerPage);
    }

    // @phpstan-ignore-next-line
    public function getSetsReport(CardSeries $cardSeries): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?: self::PER_PAGE;

        $query = PopReportsSet::join('card_sets', 'pop_reports_sets.card_set_id', 'card_sets.id')
            ->where('pop_reports_sets.card_series_id', $cardSeries->id)
            ->select('*')
            ->addSelect(DB::raw('(total + total_plus) as total_graded'));

        return QueryBuilder::for($query)
            ->allowedSorts(['card_series_id', 'total_graded'])
            ->defaultSort('-total_graded')
            ->paginate($itemsPerPage);
    }

    // @phpstan-ignore-next-line
    public function getCardsReport(CardSet $cardSet): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?: self::PER_PAGE;

        $query = PopReportsCard::join('card_products', 'pop_reports_cards.card_product_id', 'card_products.id')
            ->where('pop_reports_cards.card_set_id', $cardSet->id)
            ->whereNull('card_products.deleted_at')
            ->select('*')
            ->addSelect(DB::raw('(total + total_plus) as total_graded'));

        return QueryBuilder::for($query)
            ->allowedSorts(['card_series_id', 'total_graded'])
            ->defaultSort('-total_graded')
            ->paginate($itemsPerPage);
    }

    public function getSeriesTotalPopulation(CardCategory $cardCategory): mixed
    {
        return $this->getTotalPopulation(PopReportsSeries::whereHas('cardSeries', function ($query) use ($cardCategory) {
            return $query->where('card_category_id', $cardCategory->id);
        }));
    }

    public function getSetsTotalPopulation(CardSeries $cardSeries): mixed
    {
        return $this->getTotalPopulation(PopReportsSet::where('card_series_id', $cardSeries->id));
    }

    public function getCardProductsTotalPopulation(CardSet $cardSet): mixed
    {
        return $this->getTotalPopulation(PopReportsCard::where('card_set_id', $cardSet->id));
    }

    /**
     * @return Collection<int, CardProduct>
     */
    public function searchCardsWithMissingPopReports(): Collection
    {
        return CardProduct::join('order_items', 'order_items.card_product_id', 'card_products.id')
            ->join('orders', 'orders.id', 'order_items.order_id')
            ->where('order_items.order_item_status_id', OrderItemStatus::GRADED)
            ->whereIn('orders.order_status_id', [OrderStatus::GRADED, OrderStatus::ASSEMBLED, OrderStatus::SHIPPED])
            ->doesntHave('popReportsCard')
            ->select('card_products.*')
            ->distinct()->get();
    }

    protected function accumulateReportRow(Collection $userCards): array
    {
        $reportsTableArray = $this->reportsTableArray;

        foreach ($userCards as $userCard) {
            $columnName = $this->cleanColumnName($userCard->overall_grade);

            try {
                $reportsTableArray[$columnName] += 1;

                if (str_contains($columnName, 'plus') || $columnName === 'fr') {
                    $reportsTableArray['total_plus'] += 1;
                } else {
                    $reportsTableArray['total'] += 1;
                }
            } catch (\Exception $e) {
                Log::info('User Card not added for id '.$userCard->id);
                Log::info($e->getMessage());
            }
        }

        return $reportsTableArray;
    }

    protected function generateReportEmptyArray()
    {
        foreach (CardGradingService::GRADE_CRITERIA as $key) {
            $this->reportsTableArray[$this->cleanColumnName($key)] = 0;
        }
    }

    protected function getTotalPopulation(Builder $model): mixed
    {
        return $model->selectRaw(
            'sum(pr) as pr, sum(fr) as fr, sum(good) as good, sum(good_plus) as good_plus,
            sum(vg) as vg, sum(vg_plus) as vg_plus, sum(vg_ex) as vg_ex, sum(vg_ex_plus) as vg_ex_plus, sum(ex) as ex,
            sum(ex_plus) as ex_plus, sum(ex_mt) as ex_mt, sum(ex_mt_plus) as ex_mt_plus, sum(nm) as nm, sum(nm_plus) as nm_plus,
            sum(nm_mt) as nm_mt, sum(nm_mt_plus) as nm_mt_plus, sum(mint) as mint, sum(mint_plus) as mint_plus, sum(gem_mt) as gem_mt,
            sum(total) as total, sum(total_plus) as total_plus'
        )->first();
    }

    protected function cleanColumnName($grade): string
    {
        return str_replace('+', '_plus', str_replace('-', '_', strtolower(array_search($grade, CardGradingService::GRADE_CRITERIA))));
    }

    /**
     * @param  Builder <CardSet>|Builder <CardSeries>|Builder <CardProduct>|Builder <UserCard>  $query
     * @return Builder <CardSet>|Builder <CardSeries>|Builder <CardProduct>|Builder <UserCard>
     */
    protected function isCardInformationComplete(Builder $query): Builder
    {
        return $query->whereNotNull('card_products.card_category_id')
            ->whereNotNull('card_products.card_set_id')
            ->whereNotNull('card_products.card_number_order');
    }

    protected function info(string $string): void
    {
        echo $string;
        Log::info($string);
    }
}
