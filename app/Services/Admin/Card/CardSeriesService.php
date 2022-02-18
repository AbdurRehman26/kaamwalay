<?php

namespace App\Services\Admin\Card;

use App\Events\API\Admin\CardSeries\CardSeriesCreatedEvent;
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
        $query = CardSeries::select('id', 'name', 'card_category_id', 'image_path');

        if (request('category_id')) {
            $query->where('card_category_id', request('category_id'));
        }

        return QueryBuilder::for($query)->get();
    }

    public function create(array $data): CardSeries
    {
        $this->getOrCreateSeriesFromAgs($data['name'], $data['image_path']);

        $series = CardSeries::create([
            'name' => $data['name'],
            'image_path' => $data['image_path'],
            'image_bucket_path' => $data['image_path'],
            'card_category_id' => $data['card_category_id'],
        ]);

        CardSeriesCreatedEvent::dispatch($series);

        return $series;
    }

    protected function getOrCreateSeriesFromAgs(string $seriesName, string $seriesImage): int | null
    {
        //Store in AGS
        $seriesResponse = $this->agsService->getCardSeries(['name' => $seriesName]);

        if ($seriesResponse['count'] > 0) {
            return $seriesResponse['results'][0]['id'];
        } elseif ($seriesName && $seriesImage) {
            $createSeriesResponse = $this->agsService->createCardSeries(['name' => $seriesName, 'image_path' => $seriesImage]);

            if (array_key_exists('id', $createSeriesResponse)) {
                return $createSeriesResponse['id'];
            }
        }

        return null;
    }
}
