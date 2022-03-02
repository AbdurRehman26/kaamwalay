<?php

namespace App\Services\Admin\Card;

use App\Events\API\Admin\Card\CardSetCreatedEvent;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Services\AGS\AgsService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Spatie\QueryBuilder\QueryBuilder;

class CardSetService
{
    public function __construct(protected AgsService $agsService)
    {
    }

    public function search(): Collection
    {
        $query = CardSet::query();

        if (request('series_id')) {
            $query->where('card_series_id', request('series_id'));
        }

        return QueryBuilder::for($query)->get();
    }

    public function create(array $data): CardSet
    {
        $this->createSetOnAgs($data['card_series_id'], $data['name'], $data['image_path'], $data);

        $set = CardSet::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? '',
            'image_path' => $data['image_path'],
            'image_bucket_path' => $data['image_path'],
            'card_category_id' => CardSeries::find($data['card_series_id'])->card_category_id,
            'card_series_id' => $data['card_series_id'],
            'release_date' => $data['release_date'],
            'release_year' => (new Carbon($data['release_date']))->format('Y'),
        ]);

        CardSetCreatedEvent::dispatch($set);

        return $set;
    }

    protected function getSeriesFromAgs(string $seriesName): int | null
    {
        return $this->agsService->getCardSeries(['name' => $seriesName])['results'][0]['id'];
    }

    protected function createSetOnAgs(int $seriesId, string $setName, string $setImage, array $data): void
    {
        $agsSeriesId = $this->getSeriesFromAgs(CardSeries::find($seriesId)->name);

        //Check if set already exists in AGS DB
        $setResponse = $this->agsService->getCardSet([
            'name' => $setName,
            'serie' => $agsSeriesId,
        ]);

        //If it doesn't exist, and we have required parameters, create it in AGS side
        if ($setResponse['count'] < 1 && $setName && $seriesId && $data['release_date'] && $setImage) {
            $this->agsService->createCardSet([
                'name' => $setName,
                'image_path' => $setImage,
                'release_date' => $data['release_date'],
                'serie_id' => $agsSeriesId,
            ]);
        }
    }
}
