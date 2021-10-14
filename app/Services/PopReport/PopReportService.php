<?php

namespace App\Services\PopReport;

use App\Models\PopCardsReport;
use App\Models\PopSeriesReport;
use App\Models\PopSetsReport;
use App\Models\UserCard;
use App\Services\Admin\CardGradingService;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class PopReportService
{
    public function updateSeriesReport(int $cardSeriesId)
    {
        $userCards = UserCard::join('order_items', 'user_cards.order_item_id', 'order_items.id')
            ->join('card_products', 'order_items.card_product_id', 'card_products.id')
            ->join('card_sets', 'card_products.card_set_id', 'card_sets.id')
            ->where('card_sets.card_series_id', $cardSeriesId)
            ->where('user_cards.overall_grade', '>', 0)
            ->select('user_cards.overall_grade')
            ->get();

        foreach ($userCards as $userCard) {
            $columnName = $this->cleanColumnName($userCard->overall_grade);

            try {
                $popSeriesReportModel = PopSeriesReport::firstOrCreate([ 'card_series_id' => $cardSeriesId ]);
                $popSeriesReportModel->increment($columnName, 1);

                if (str_contains($columnName, "plus")) {
                    $popSeriesReportModel->increment("total_plus", 1);
                } else {
                    $popSeriesReportModel->increment("total", 1);
                }
            } catch (\Exception $e) {
                \Log::info("Card Series Report not added for id " . $cardSeriesId);
                \Log::info($e->getMessage());
            }
        }
    }

    public function updateSetsReport(int $cardSetId)
    {
        $userCards = UserCard::join('order_items', 'user_cards.order_item_id', 'order_items.id')
            ->join('card_products', 'order_items.card_product_id', 'card_products.id')
            ->join('card_sets', 'card_products.card_set_id', 'card_sets.id')
            ->where('card_products.card_set_id', $cardSetId)
            ->where('user_cards.overall_grade', '>', 0)
            ->select('user_cards.overall_grade', 'card_sets.card_series_id as card_series_id')
            ->get();

        foreach ($userCards as $userCard) {
            $columnName = $this->cleanColumnName($userCard->overall_grade);

            try {
                $popSetReportModel = PopSetsReport::firstOrCreate([ 'card_set_id' => $cardSetId , 'card_series_id' => $userCard->card_series_id ]);
                $popSetReportModel->increment($columnName, 1);

                if (str_contains($columnName, "plus")) {
                    $popSetReportModel->increment("total_plus", 1);
                } else {
                    $popSetReportModel->increment("total", 1);
                }
            } catch (\Exception $e) {
                \Log::info("Card Set Report not added for id " . $cardSetId);
                \Log::info($e->getMessage());
            }
        }
    }

    public function updateCardProductsReport(int $cardProductId)
    {
        $userCards = UserCard::join('order_items', 'user_cards.order_item_id', 'order_items.id')
            ->join('card_products', 'order_items.card_product_id', 'card_products.id')
            ->where('card_products.id', $cardProductId)
            ->where('user_cards.overall_grade', '>', 0)
            ->select('user_cards.overall_grade', 'card_products.card_set_id as card_set_id')
            ->get();

        foreach ($userCards as $userCard) {
            $columnName = $this->cleanColumnName($userCard->overall_grade);

            try {
                $popCardReportModel = PopCardsReport::firstOrCreate([ 'card_product_id' => $cardProductId , 'card_set_id' => $userCard->card_set_id ]);
                $popCardReportModel->increment($columnName, 1);

                if (str_contains($columnName, "plus")) {
                    $popCardReportModel->increment("total_plus", 1);
                } else {
                    $popCardReportModel->increment("total", 1);
                }
            } catch (\Exception $e) {
                \Log::info("Card Set Report not added for id " . $cardProductId);
                \Log::info($e->getMessage());
            }
        }
    }

    public function getSeriesReport(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?: 100;

        $query = PopSeriesReport::join('card_series', 'pop_series_reports.card_series_id', 'card_series.id');

        return QueryBuilder::for($query)
            ->allowedSorts(['card_series_id'])
            ->paginate($itemsPerPage);
    }

    public function getSetsReport(int $seriesId): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?: 100;

        $query = PopSetsReport::join('card_sets', 'pop_sets_reports.card_set_id', 'card_sets.id')
        ->where('pop_sets_reports.card_series_id', $seriesId);

        return QueryBuilder::for($query)
            ->allowedSorts(['card_sets_id'])
            ->paginate($itemsPerPage);
    }

    public function getCardsReport(int $setId): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?: 100;

        $query = PopCardsReport::join('card_products', 'pop_cards_reports.card_product_id', 'card_products.id')
        ->where('pop_cards_reports.card_set_id', $setId);

        return QueryBuilder::for($query)
            ->allowedSorts(['card_sets_id'])
            ->paginate($itemsPerPage);
    }

    public function getSeriesTotalPopulation()
    {
        return $this->getTotalPopulation(new PopSeriesReport());
    }

    public function getSetsTotalPopulation($seriesId)
    {
        return $this->getTotalPopulation(PopSetsReport::where('card_series_id', $seriesId));
    }

    public function getCardProductsTotalPopulation($setId)
    {
        return $this->getTotalPopulation(PopCardsReport::where('card_set_id', $setId));
    }

    protected function getTotalPopulation($model)
    {
        return $model->selectRaw(
            'sum(pr) as pr, sum(fr_plus) as fr_plus, sum(good) as good, sum(good_plus) as good_plus,
            sum(vg) as vg, sum(vg_plus) as vg_plus, sum(vg_ex) as vg_ex, sum(vg_ex_plus) as vg_ex_plus, sum(ex) as ex,
            sum(ex_plus) as ex_plus, sum(ex_mt) as ex_mt, sum(ex_mt_plus) as ex_mt_plus, sum(nm) as nm, sum(nm_plus) as nm_plus,
            sum(nm_mt) as nm_mt, sum(nm_mt_plus) as nm_mt_plus, sum(mint) as mint, sum(mint_plus) as mint_plus, sum(gem_mt) as gem_mt,
            sum(total) as total, sum(total_plus) as total_plus'
        )->get()->first();
    }

    protected function cleanColumnName($overallGrade): string
    {
        return str_replace('+', 'good', str_replace('-', '_', strtolower(array_search($overallGrade, CardGradingService::GRADE_CRITERIA))));
    }
}
