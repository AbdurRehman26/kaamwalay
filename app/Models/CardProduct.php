<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class CardProduct extends Model
{
    use HasFactory;
    use Searchable;

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
    public function toSearchableArray()
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

    public function getLongName(): string
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

    public function getCategoryAbbreviation(): string
    {
        if(!in_array($this->cardCategory->name, ['Pokemon', 'MetaZoo'])){
            return '';
        }

        $categoryList = [
            'Pokemon' => 'P.M.',
            'MetaZoo' => 'M.T.Z.'
        ];

        return $categoryList[Str::lower($this->cardCategory->name)];
    }

    public function getSeriesNickname(): string
    {
        $seriesAbbreviationQuery = SeriesAbbreviation::category($this->cardCategory)->where('name', $this->cardSet->cardSeries->name);
        if($seriesAbbreviationQuery->doesntExist()){
            return '';
        }

        return $seriesAbbreviationQuery->first()->abbreviation;
    }

    public function getSetNickname(): string
    {
        $setAbbreviationQuery = SetAbbreviation::
            category($this->cardCategory)
            ->language($this->language)
            ->where('name', $this->cardSet->name);

        if($setAbbreviationQuery->doesntExist()){
            return '';
        }

        return $setAbbreviationQuery->first()->abbreviation;
    }

    public function getSurfaceAbbreviation(): string
    {
        $surfaceList = [
            'Holo' => 'HOLO',
            'Cracked Ice Holo' => 'CI.HOLO',
            'Cosmos Holo' => 'C.HOLO',
            'Reverse Holo' => 'REV.HOLO',
            'Reverse Foil' => 'REV.FOIL',
            'Cracked Ice Reverse Holo' => 'CI REV.HOLO',
            'Sheen Holo' => 'SHEEN HOLO',
            'Mirror Holo' => 'MIR.HOLO',
            'Tinsel Holo' => 'TNSL.HOLO',
            'Speckle Holo' => 'SPKLE.HOLO',
            'Sparkle Holo' => 'SPRKL.HOLO',
            'Crosshatch Holo' => 'XHTCH.HOLO'
        ];

        return !empty($surfaceList[$this->surface]) ? $surfaceList[$this->surface] : '';
    }

    public function getEditionAbbreviation(): string
    {
        $editionList = [
            'Kickstarter' => 'KS',
            '1st Edition' => '1ST ED',
            '2nd Edition' => '2ND ED'
        ];

        return !empty($editionList[$this->edition]) ? $editionList[$this->edition] : '';
    }

    public function getLanguageAbbreviation(): string
    {
        if(!in_array(Str::lower($this->language), ['english', 'japanese'])){
            return '';
        }

        $languageList = [
            'english' => 'ENG',
            'japanese' => 'JPN.'
        ];

        return $languageList[Str::lower($this->language)];
    }

    public function cardLabel(): HasOne
    {
        return $this->hasOne(CardLabel::class);
    }

}
