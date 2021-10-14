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
            ->select('user_cards.overall_grade')
            ->get();

        foreach ($userCards as $userCard) {
            $columnName = $this->cleanColumnName($userCard->overall_grade);

            try {
                $popSeriesReportModel = PopSeriesReport::firstOrCreate([ 'card_series_id' => $cardSeriesId ]);
                $popSeriesReportModel->increment($columnName, 1);
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
            ->select('user_cards.overall_grade', 'card_sets.card_series_id as card_series_id')
            ->get();

        foreach ($userCards as $userCard) {
            $columnName = $this->cleanColumnName($userCard->overall_grade);

            try {
                $popSetReportModel = PopSetsReport::firstOrCreate([ 'card_set_id' => $cardSetId , 'card_series_id' => $userCard->card_series_id ]);
                $popSetReportModel->increment($columnName, 1);
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
            ->select('user_cards.overall_grade', 'card_products.card_set_id as card_set_id')
            ->get();

        foreach ($userCards as $userCard) {
            $popCardReportModel = PopCardsReport::firstOrCreate([ 'card_product_id' => $cardProductId , 'card_set_id' => $userCard->card_set_id ]);

            $columnName = $this->cleanColumnName($userCard->overall_grade);

            try {
                $popCardReportModel->increment($columnName, 1);
            } catch (\Exception $e) {
                \Log::info("Card Set Report not added for id " . $cardProductId);
                \Log::info($e->getMessage());
            }
        }
    }

    public function getSeriesReport(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?: 150;

        $query = PopSeriesReport::join('card_series', 'pop_series_reports.card_series_id', 'card_series.id');

        return QueryBuilder::for($query)
            ->allowedSorts(['card_series_id'])
            ->paginate($itemsPerPage);
    }

    public function getSetsReport(): array
    {
        return [];
    }

    public function getCardsReport(): array
    {
        return [];
    }

    public function cleanColumnName($overallGrade)
    {
        return str_replace('+', 'good', str_replace('-', '_', strtolower(array_search($overallGrade, CardGradingService::GRADE_CRITERIA))));
    }
}
