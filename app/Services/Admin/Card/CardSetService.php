<?php

namespace App\Services\Admin\Card;

use App\Events\API\Admin\Card\CardSetCreatedEvent;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Services\AGS\AgsService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\QueryBuilder;
use Exception;

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
        Log::info('SET_CREATION_REQUEST', $data);
        $agsResponse = $this->createSetOnAgs($data['card_series_id'], $data['name'], $data['image_path'], $data);
        Log::info('SET_CREATION_AGS_RESPONSE', $agsResponse);

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

    protected function getSeriesFromAgs(string $seriesName, string $categoryName): ?int
    {
        return $this->agsService->getCardSeries([
            'exact_name' => $seriesName,
            'exact_category_name' => $categoryName,
        ])['results'][0]['id'];
    }

    protected function createSetOnAgs(int $seriesId, string $setName, string $setImage, array $data): array
    {
        try {
            $cardSeries = CardSeries::find($seriesId);
            $agsSeriesId = $this->getSeriesFromAgs($cardSeries->name, $cardSeries->cardCategory->name);

            //Check if set already exists in AGS DB
            $setResponse = $this->agsService->getCardSet([
                'exact_name' => $setName,
                'serie' => $agsSeriesId,
            ]);

            //If it doesn't exist, and we have required parameters, create it in AGS side
            if ($setResponse['count'] < 1 && $setName && $seriesId && $data['release_date'] && $setImage) {
                $createData = [
                    'name' => $setName,
                    'image_path' => $setImage,
                    'release_date' => $data['release_date'],
                    'serie_id' => $agsSeriesId,
                ];

                Log::info('SET_CREATION_AGS_REQUEST', $createData);

                return $this->agsService->createCardSet($createData);
            }

           return [];
        } catch (Exception $e) {
            report($e);

            return [];
        }
    }
}
