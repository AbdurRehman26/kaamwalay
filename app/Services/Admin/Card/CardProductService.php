<?php

namespace App\Services\Admin\Card;

use App\Events\API\Admin\Card\CardProductCreatedEvent;
use App\Events\API\Admin\Card\CardProductDeletedEvent;
use App\Exceptions\API\Admin\CardProductCanNotBeCreated;
use App\Exceptions\API\Admin\CardProductCanNotBeDeleted;
use App\Exceptions\API\Admin\CardProductCanNotBeUpdated;
use App\Exceptions\API\Admin\CardProductHasUserCardException;
use App\Exceptions\API\Admin\InvalidCardReferenceIdException;
use App\Http\Filters\AdminCardProductSearchFilter;
use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Models\CardRarity;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\CardSurface;
use App\Services\AGS\AgsService;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class CardProductService
{
    public const CARD_EDITIONS = [
        '1st Edition',
        'Shadowless',
        'Unlimited',
    ];

    public const CARD_LANGUAGES = [
        'Japanese',
        'English',
        'Dutch',
        'German',
        'French',
        'Italian',
        'Spanish',
        'Portuguese',
        '(South) Korean',
        'Thai',
        'Traditional Chinese',
        'Russian',
        'Polish',
    ];

    public function __construct(protected AgsService $agsService)
    {
    }

    public function create(array $data): CardProduct
    {
        $category = CardCategory::find($data['category']);

        $seriesName = CardSeries::find($data['series_id'])->name;

        $set = CardSet::find($data['set_id']);

        Log::info('CARD_CREATION_REQUEST', $data);

        //store in AGS
        $agsResponse = $this->createCardProductOnAgs($category, $seriesName, $set->name, $data);

        Log::info('CARD_CREATION_AGS_RESPONSE', $agsResponse);

        if (! $agsResponse || ! array_key_exists('id', $agsResponse)) {
            throw new CardProductCanNotBeCreated;
        }

        $card = new CardProduct([
            'name' => $data['name'],
            'card_set_id' => $set->id,
            'card_category_id' => $category->id,
            'rarity' => $data['rarity'],
            'card_number' => $data['card_number'],
            'card_number_order' => $data['card_number'],
            'image_path' => $data['image_path'],
            'edition' => $data['edition'] ?? 'Unlimited',
            'surface' => $data['surface'] ?? '',
            'variant' => $data['variant'] ?? '',
            'language' => $data['language'],
            'added_manually' => true,
            'added_by' => auth()->user()->id,
            'card_reference_id' => $agsResponse['card_reference_id'],
        ]);
        $card->save();

        CardProductCreatedEvent::dispatch($card);

        return $card;
    }

    public function getOptionsValues(CardCategory $cardCategory): array
    {
        return [
            'rarity' => CardRarity::where('card_category_id', $cardCategory->id)->pluck('name')->toArray(),
            'edition' => CardProductService::CARD_EDITIONS,
            'surface' => CardSurface::where('card_category_id', $cardCategory->id)->pluck('name')->toArray(),
            'language' => CardProductService::CARD_LANGUAGES,
        ];
    }

    protected function createCardProductOnAgs(CardCategory $category, string $seriesName, string $setName, array $data): array
    {
        try {
            $createData['series_id'] = $this->getSeriesFromAgs($seriesName, $category->name);
            $createData['set_id'] = $this->getSetFromAgs($createData['series_id'], $setName);

            $createData = array_merge($createData, [
                'name' => $data['name'],
                'category_id' => $category->id,
                'rarity' => $data['rarity'],
                'card_number_order' => $data['card_number'],
                'image_path' => $data['image_path'],
                'edition' => $data['edition'] ?? 'Unlimited',
                'surface' => $data['surface'] ?? '',
                'variant' => $data['variant'] ?? '',
                'language' => $data['language'],
            ]);

            Log::info('CARD_CREATION_AGS_REQUEST', $createData);

            return $this->agsService->createCard($createData);
        } catch (Exception $e) {
            report($e);

            return [];
        }
    }

    protected function getSeriesFromAgs(string $seriesName, string $categoryName): int | null
    {
        return $this->agsService->getCardSeries(['exact_name' => $seriesName, 'exact_category_name' => $categoryName])['results'][0]['id'];
    }

    protected function getSetFromAgs(int $seriesId, string $setName): int | null
    {
        return $this->agsService->getCardSet([
            'exact_name' => $setName,
            'serie' => $seriesId,
        ])['results'][0]['id'];
    }

    /**
     * @return LengthAwarePaginator<CardProduct>
     */
    public function getCards(): LengthAwarePaginator
    {
        // @phpstan-ignore-next-line
        return QueryBuilder::for(CardProduct::class)
            ->leftJoin('pop_reports_cards', 'pop_reports_cards.card_product_id', '=', 'card_products.id')
            ->addSelect(DB::raw('card_products.*, pop_reports_cards.population'))
            ->excludeAddedManually()
            ->allowedFilters([
                AllowedFilter::scope('card_category'),
                AllowedFilter::scope('release_date'),
                AllowedFilter::custom('search', new AdminCardProductSearchFilter),
            ])
            ->allowedSorts(['population'])
            ->defaultSort('-population')
            ->paginate(request('per_page', 10));
    }

    /**
     * @throws CardProductCanNotBeUpdated
     */
    public function updateCard(CardProduct $cardProduct, array $data): CardProduct
    {
        $agsResponse = $this->updateCardProductOnAgs($cardProduct, $data);

        if (! $agsResponse || ! array_key_exists('id', $agsResponse)) {
            throw new CardProductCanNotBeUpdated;
        }

        $cardProduct->fill([
            'image_path' => $data['image_path'],
            'name' => $data['name'],
            'release_date' => $data['release_date'],
            'card_number' => $data['card_number'],
            'language' => $data['language'],
            'rarity' => $data['rarity'],
            'edition' => $data['edition'] ?? 'Unlimited',
            'surface' => $data['surface'] ?? '',
            'variant' => $data['variant'] ?? '',
        ]);
        $cardProduct->save();

        $this->reindexUserCards($cardProduct);

        return $cardProduct;
    }

    protected function updateCardProductOnAgs(CardProduct $cardProduct, array $data): array
    {
        $updateData = [
            'card_reference_id' => $cardProduct->card_reference_id,
            'image_path' => $data['image_path'],
            'name' => $data['name'],
            'card_number_order' => $data['card_number'],
            'language' => $data['language'],
            'rarity' => $data['rarity'],
            'edition' => $data['edition'] ?? 'Unlimited',
            'surface' => $data['surface'] ?? '',
            'variant' => $data['variant'] ?? '',
        ];

        try {
            return $this->agsService->updateCard($updateData);
        } catch (Exception $e) {
            report($e);

            return [];
        }
    }

    /**
     * @throws CardProductCanNotBeDeleted
     * @throws Throwable
     */
    public function deleteCard(CardProduct $cardProduct): void
    {
        throw_if($cardProduct->userCards()->count() > 0, CardProductHasUserCardException::class);
        throw_if(empty($cardProduct->card_reference_id), InvalidCardReferenceIdException::class);

        $agsResponse = $this->deleteCardProductFromAgs($cardProduct);

        if (! $agsResponse || ! array_key_exists('success', $agsResponse)) {
            throw new CardProductCanNotBeDeleted;
        }

        CardProductDeletedEvent::dispatch($cardProduct);
        $cardProduct->delete();
    }

    protected function deleteCardProductFromAgs(CardProduct $cardProduct): array
    {
        try {
            return $this->agsService->deleteCard($cardProduct->card_reference_id);
        } catch (Exception $e) {
            report($e);

            return [];
        }
    }

    protected function reindexUserCards(CardProduct $cardProduct): void
    {
        // @phpstan-ignore-next-line
        $cardProduct->userCards()->searchable();
    }
}
