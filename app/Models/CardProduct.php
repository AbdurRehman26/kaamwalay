<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class CardProduct extends Model
{
    use HasFactory;
    use Searchable;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'card_set_id',
        'card_category_id',
        'name',
        'rarity',
        'card_number',
        'set_name',
        'image_path',
        'card_url',
        'image_bucket_path',
        'card_number_order',
        'edition',
        'surface',
        'variant',
        'card_reference_id',
        'language',
        'description',
        'added_manually',
        'added_by',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray(): array
    {
        $array = [
            'id' => $this->id,
            'name' => $this->name,
            'searchable_name' => $this->getSearchableName(),
            'long_name' => $this->getLongName(),
            'short_name' => $this->getShortName(),
            'card_category_name' => $this->cardCategory->name,
            'card_set_name' => $this->cardSet->name,
            'card_series_name' => $this->cardSet->cardSeries->name,
            'release_year' => $this->cardSet->release_year,
            'card_number_order' => is_numeric($this->card_number_order) ? Str::padLeft($this->card_number_order, 3, '0') : $this->card_number_order,
            'image_path' => $this->image_path,
            'card_reference_id' => $this->card_reference_id,
            'variant' => $this->variant,
            'surface' => $this->surface,
            'edition' => $this->edition,
            'language' => $this->language,
        ];

        return $array;
    }

    /**
     * @param  Builder <Model> $query
     * @return Builder <Model>
     */
    public function scopeCanBeInitializedInPopReport(Builder $query): Builder
    {
        return $query->leftJoin('pop_reports_cards', 'pop_reports_cards.card_product_id', '=', 'card_products.id')
            ->whereNull('pop_reports_cards.id');
    }

    public function shouldBeSearchable(): bool
    {
        return ! $this->added_manually || $this->isCardInformationComplete();
    }

    public function cardSet(): BelongsTo
    {
        return $this->belongsTo(CardSet::class);
    }

    public function cardCategory(): BelongsTo
    {
        return $this->belongsTo(CardCategory::class);
    }

    public function addedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    /**
     * @return HasOne<PopReportsCard>
     */
    public function popReportsCard(): HasOne
    {
        return $this->hasOne(PopReportsCard::class);
    }

    public function isCardInformationComplete(): bool
    {
        return $this->card_category_id && $this->card_set_id && ! is_null($this->card_number_order);
    }

    public function getFormattedCardNumber(): string | null
    {
        return is_numeric($this->card_number_order) ? Str::padLeft($this->card_number_order, 3, '0') : $this->card_number_order;
    }

    public function getShortName(): string
    {
        if ($this->isCardInformationComplete()) {
            $language = $this->language !== 'English' ? $this->language . ' - ' : '';
            $edition = $this->edition !== 'Unlimited' ? $this->edition . ' - ' : '';
            $surface = $this->surface ? $this->surface . ' - ' : '';
            $variant = $this->variant ?: '';

            $shortName = $language . $edition . $surface . $variant;

            if (str_ends_with($shortName, ' - ')) {
                $shortName = substr_replace($shortName, '', -3);
            }

            return $shortName;
        }

        return 'Added Manually';
    }

    public function getLongName(): ?string
    {
        if ($this->isCardInformationComplete()) {
            $series = $this->cardSet->cardSeries->name == $this->cardSet->name ? '' :  $this->cardSet->cardSeries->name . ' ';

            return $this->cardSet->release_year . ' ' . $this->cardCategory->name . ' ' . $series . $this->cardSet->name . ' ' . $this->card_number_order;
        }

        return $this->description;
    }

    public function getSearchableName(): string
    {
        return $this->getLongName() . ' ' . $this->getShortName() . ' ' . $this->name;
    }

    /**
     * @param  Builder <CardProduct> $query
     * @return Builder <CardProduct>
     */
    public function scopeCardCategory(Builder $query, int $categoryId): Builder
    {
        return $query->whereHas(
            'cardCategory',
            fn (Builder $subQuery) => $subQuery->where('card_categories.id', $categoryId)
        );
    }

    /**
     * @param  Builder <CardProduct> $query
     * @return Builder <CardProduct>
     */
    public function scopeReleaseDate(Builder $query, string $startDate, string $endDate): Builder
    {
        return $query->whereHas(
            'cardSet',
            fn (Builder $subQuery) => (
                $subQuery->whereBetween(
                    'card_sets.release_date',
                    [Carbon::parse($startDate)->startOfDay(), Carbon::parse($endDate)->endOfDay()]
                )
            )
        );
    }

    /**
     * @return HasMany<OrderItem>
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
    public function getCategoryAbbreviation(): string
    {
        if (! in_array(Str::lower($this->cardCategory->name), ['pokemon', 'metazoo'])) {
            return '';
        }

        $categoryList = [
            'pokemon' => 'P.M.',
            'metazoo' => 'M.T.Z.',
        ];

        return $categoryList[Str::lower($this->cardCategory->name)];
    }

    public function getSeriesNickname(): string
    {
        $seriesAbbreviationQuery = CardSeriesAbbreviation::category($this->cardCategory)
            ->language($this->language)
            ->where(function ($query) {
                $query->where('name', $this->cardSet->cardSeries->name)
                ->orWhere('name', str_replace(' Series', '', $this->cardSet->cardSeries->name));
            });

        if ($seriesAbbreviationQuery->doesntExist()) {
            return '';
        }

        return $seriesAbbreviationQuery->first()->abbreviation;
    }

    public function getSetNickname(): string
    {
        $setAbbreviationQuery = CardSetAbbreviation::category($this->cardCategory)
            ->language($this->language)
            ->where(function ($query) {
                $query->where('name', $this->cardSet->name)
                ->orWhere('name', str_replace(' Set', '', $this->cardSet->name));
            });

        if ($setAbbreviationQuery->doesntExist()) {
            return '';
        }

        return $setAbbreviationQuery->first()->abbreviation;
    }

    public function getSurfaceAbbreviation(): string
    {
        $query = CardSurfaceAbbreviation::whereName($this->surface);

        if ($query->doesntExist()) {
            return '';
        }

        return $query->first()->abbreviation;
    }

    public function getEditionAbbreviation(): string
    {
        $query = CardEditionAbbreviation::whereName($this->edition);

        if ($query->doesntExist()) {
            return '';
        }

        return $query->first()->abbreviation;
    }

    public function getLanguageAbbreviation(): string
    {
        if (! in_array(Str::lower($this->language), ['english', 'japanese'])) {
            return '';
        }

        $languageList = [
            'english' => 'ENG',
            'japanese' => 'JPN.',
        ];

        return $languageList[Str::lower($this->language)];
    }

    /**
     * @return HasOne <CardLabel>
     */
    public function cardLabel(): HasOne
    {
        return $this->hasOne(CardLabel::class);
    }

    /**
     * @return HasManyThrough<UserCard>
     */
    public function userCards(): HasManyThrough
    {
        return $this->hasManyThrough(UserCard::class, OrderItem::class)
            ->whereHas(
                'orderItem.order',
                fn ($query) => ($query->where('order_status_id', '>=', OrderStatus::SHIPPED))
            );
    }

    /**
     * @param  Builder<CardProduct> $query
     * @return Builder<CardProduct>
     */
    public function scopeExcludeAddedManually(Builder $query): Builder
    {
        return $query->where('added_manually', 0)
            ->orWhere(fn ($query) => (
                $query->whereNotNull('card_products.card_category_id')
                    ->whereNotNull('card_products.card_set_id')
                    ->whereNotNull('card_products.card_number_order')
            ));
    }
}
