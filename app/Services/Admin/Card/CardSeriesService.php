<?php

namespace App\Services\Admin\Card;

use App\Events\API\Admin\Card\CardSeriesCreatedEvent;
use App\Models\CardCategory;
use App\Models\CardSeries;
use App\Services\AGS\AgsService;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\QueryBuilder;

class CardSeriesService
{
    public function __construct(protected AgsService $agsService)
    {
    }

    public function search(): Collection
    {
        $query = CardSeries::query();

        if (request('category_id')) {
            $query->where('card_category_id', request('category_id'));
        }

        return QueryBuilder::for($query)->get();
    }

    public function create(array $data): CardSeries
    {
        Log::info('SERIES_CREATION_REQUEST', $data);
        $agsResponse = $this->createSeriesOnAgs($data['card_category_id'], $data['name'], $data['image_path']);
        Log::info('SERIES_CREATION_AGS_RESPONSE', $agsResponse);

        $series = CardSeries::create([
            'name' => $data['name'],
            'image_path' => $data['image_path'],
            'image_bucket_path' => $data['image_path'],
            'card_category_id' => $data['card_category_id'],
        ]);

        CardSeriesCreatedEvent::dispatch($series);

        return $series;
    }

    protected function createSeriesOnAgs(int $cardCategoryId, string $seriesName, string $seriesImage): array
    {
        try {
            $categoryName = CardCategory::find($cardCategoryId)->name;

            //Check if series already exists in AGS DB
            $seriesResponse = $this->agsService->getCardSeries([
                'exact_name' => $seriesName,
                'exact_category_name' => $categoryName,
            ]);

            //If it doesn't exist, and we have required parameters, create it in AGS side
            if ($seriesResponse['count'] < 1 && $seriesName && $seriesImage) {
                $createData = [
                    'name' => $seriesName,
                    'image_path' => $seriesImage,
                    'category_name' => $categoryName,
                ];

                Log::info('SERIES_CREATION_AGS_REQUEST', $createData);

                return $this->agsService->createCardSeries($createData);
            }

            return [];
        } catch (Exception $e) {
            report($e);

            return [];
        }
    }
}
