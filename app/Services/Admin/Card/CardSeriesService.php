<?php

namespace App\Services\Admin\Card;

use App\Events\API\Admin\Card\CardSeriesCreatedEvent;
use App\Models\CardSeries;
use App\Services\AGS\AgsService;
use Illuminate\Database\Eloquent\Collection;
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
        $this->createSeriesOnAgs($data['name'], $data['image_path']);

        $series = CardSeries::create([
            'name' => $data['name'],
            'image_path' => $data['image_path'],
            'image_bucket_path' => $data['image_path'],
            'card_category_id' => $data['card_category_id'],
        ]);

        CardSeriesCreatedEvent::dispatch($series);

        return $series;
    }

    protected function createSeriesOnAgs(string $seriesName, string $seriesImage): void
    {
        //Check if series already exists in AGS DB
        $seriesResponse = $this->agsService->getCardSeries(['name' => $seriesName]);

        //If it doesn't exist, and we have required parameters, create it in AGS side
        if ($seriesResponse['count'] < 1 && $seriesName && $seriesImage) {
            $this->agsService->createCardSeries(['name' => $seriesName, 'image_path' => $seriesImage]);
        }
    }
}
