<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\Address
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Address newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Address newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Address query()
 */
	class Address extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\AutographCategory
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AutographProduct> $autographProducts
 * @property-read int|null $autograph_products_count
 * @method static \Database\Factories\AutographCategoryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|AutographCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AutographCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AutographCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder|AutographCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographCategory whereUpdatedAt($value)
 */
	class AutographCategory extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\AutographProduct
 *
 * @property int $id
 * @property int $autograph_category_id
 * @property int $autograph_type_id
 * @property string $certificate_number
 * @property string $name
 * @property string $image_url
 * @property string $signed_by
 * @property \Illuminate\Support\Carbon $signed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\AutographCategory|null $autographCategory
 * @property-read \App\Models\AutographType|null $autographType
 * @method static \Database\Factories\AutographProductFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct query()
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct whereAutographCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct whereAutographTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct whereCertificateNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct whereSignedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct whereSignedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographProduct whereUpdatedAt($value)
 */
	class AutographProduct extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\AutographType
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AutographProduct> $autographProducts
 * @property-read int|null $autograph_products_count
 * @method static \Database\Factories\AutographTypeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|AutographType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AutographType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AutographType query()
 * @method static \Illuminate\Database\Eloquent\Builder|AutographType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographType whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AutographType whereUpdatedAt($value)
 */
	class AutographType extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardCategory
 *
 * @property int $id
 * @property string $name
 * @property string|null $image_url
 * @property int $is_enabled
 * @property int|null $card_category_type_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CardCategoryType|null $cardCategoryType
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CardProduct> $cardProducts
 * @property-read int|null $card_products_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CardRarity> $cardRarities
 * @property-read int|null $card_rarities_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CardSeries> $cardSeries
 * @property-read int|null $card_series_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CardSet> $cardSets
 * @property-read int|null $card_sets_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CardSurface> $cardSurfaces
 * @property-read int|null $card_surfaces_count
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory enabled()
 * @method static \Database\Factories\CardCategoryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereCardCategoryTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereIsEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereUpdatedAt($value)
 */
	class CardCategory extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardCategoryType
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CardCategory> $cardCategories
 * @property-read int|null $card_categories_count
 * @method static \Database\Factories\CardCategoryTypeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategoryType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategoryType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategoryType query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategoryType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategoryType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategoryType whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategoryType whereUpdatedAt($value)
 */
	class CardCategoryType extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardEditionAbbreviation
 *
 * @property int $id
 * @property string $name
 * @property string $abbreviation
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|CardEditionAbbreviation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardEditionAbbreviation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardEditionAbbreviation query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardEditionAbbreviation whereAbbreviation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardEditionAbbreviation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardEditionAbbreviation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardEditionAbbreviation whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardEditionAbbreviation whereUpdatedAt($value)
 */
	class CardEditionAbbreviation extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardLabel
 *
 * @property int $id
 * @property int $card_product_id
 * @property string $line_one
 * @property string $line_two
 * @property string $line_three
 * @property string $line_four
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CardProduct $cardProduct
 * @method static \Database\Factories\CardLabelFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel whereCardProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel whereLineFour($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel whereLineOne($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel whereLineThree($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel whereLineTwo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardLabel whereUpdatedAt($value)
 */
	class CardLabel extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardProduct
 *
 * @property int $id
 * @property string $name
 * @property string|null $card_reference_id
 * @property int|null $card_set_id
 * @property int|null $card_category_id
 * @property string|null $rarity
 * @property string|null $card_number
 * @property string|null $image_path
 * @property string|null $card_url
 * @property string|null $image_bucket_path
 * @property string|null $card_number_order
 * @property string $edition
 * @property string $surface
 * @property string $variant
 * @property string $language
 * @property string $variant_category
 * @property string $variant_name
 * @property string $holo_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $description
 * @property int $population
 * @property int $added_manually
 * @property int|null $added_by
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\User|null $addedBy
 * @property-read \App\Models\CardCategory|null $cardCategory
 * @property-read \App\Models\CardLabel|null $cardLabel
 * @property-read \App\Models\CardSet|null $cardSet
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $orderItems
 * @property-read int|null $order_items_count
 * @property-read \App\Models\PopReportsCard|null $popReportsCard
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UserCard> $userCards
 * @property-read int|null $user_cards_count
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct canBeInitializedInPopReport()
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct cardCategory(int $categoryId)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct excludeAddedManually()
 * @method static \Database\Factories\CardProductFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct releaseDate(string $startDate, string $endDate)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereAddedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereAddedManually($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardNumberOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardReferenceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereEdition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereHoloType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereImageBucketPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct wherePopulation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereRarity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereSurface($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereVariant($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereVariantCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereVariantName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct withoutTrashed()
 */
	class CardProduct extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardRarity
 *
 * @property int $id
 * @property int $card_category_id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CardCategory $cardCategory
 * @method static \Illuminate\Database\Eloquent\Builder|CardRarity cardCategory(int $categoryId)
 * @method static \Database\Factories\CardRarityFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CardRarity newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardRarity newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardRarity query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardRarity whereCardCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardRarity whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardRarity whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardRarity whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardRarity whereUpdatedAt($value)
 */
	class CardRarity extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardSeries
 *
 * @property int $id
 * @property string $name
 * @property string $image_path
 * @property string $image_bucket_path
 * @property int $card_category_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CardCategory $cardCategory
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CardSet> $cardSets
 * @property-read int|null $card_sets_count
 * @property-read string $release_date
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries category(\App\Models\CardCategory $cardCategory)
 * @method static \Database\Factories\CardSeriesFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries whereCardCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries whereImageBucketPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeries whereUpdatedAt($value)
 */
	class CardSeries extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardSeriesAbbreviation
 *
 * @property int $id
 * @property string $name
 * @property string $abbreviation
 * @property string $language
 * @property int $card_category_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation category(\App\Models\CardCategory $category)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation language(string $language)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation whereAbbreviation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation whereCardCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSeriesAbbreviation whereUpdatedAt($value)
 */
	class CardSeriesAbbreviation extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardSet
 *
 * @property int $id
 * @property int $card_series_id
 * @property int $card_category_id
 * @property string $name
 * @property string $description
 * @property int|null $cards_number
 * @property int|null $secret_cards
 * @property string|null $release_date_formatted
 * @property string $image_path
 * @property string $image_bucket_path
 * @property string|null $set_url
 * @property \Illuminate\Support\Carbon|null $release_date
 * @property int|null $release_year
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CardCategory $cardCategory
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CardProduct> $cardProducts
 * @property-read int|null $card_products_count
 * @property-read \App\Models\CardSeries $cardSeries
 * @method static \Database\Factories\CardSetFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereCardCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereCardSeriesId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereCardsNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereImageBucketPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereReleaseDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereReleaseDateFormatted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereReleaseYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereSecretCards($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereSetUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSet whereUpdatedAt($value)
 */
	class CardSet extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardSetAbbreviation
 *
 * @property int $id
 * @property string $name
 * @property string $abbreviation
 * @property string $language
 * @property int $card_category_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation category(\App\Models\CardCategory $category)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation language(string $language)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation whereAbbreviation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation whereCardCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSetAbbreviation whereUpdatedAt($value)
 */
	class CardSetAbbreviation extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardSurface
 *
 * @property int $id
 * @property int $card_category_id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CardCategory $cardCategory
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurface cardCategory(int $categoryId)
 * @method static \Database\Factories\CardSurfaceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurface newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurface newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurface query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurface search(string $value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurface whereCardCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurface whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurface whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurface whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurface whereUpdatedAt($value)
 */
	class CardSurface extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CardSurfaceAbbreviation
 *
 * @property int $id
 * @property string $name
 * @property string $abbreviation
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurfaceAbbreviation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurfaceAbbreviation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurfaceAbbreviation query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurfaceAbbreviation whereAbbreviation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurfaceAbbreviation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurfaceAbbreviation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurfaceAbbreviation whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardSurfaceAbbreviation whereUpdatedAt($value)
 */
	class CardSurfaceAbbreviation extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CommissionStructure
 *
 * @property int $id
 * @property int $level
 * @property float $fixed_value_per_card
 * @property float $percentage_value
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\CommissionStructureFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CommissionStructure newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CommissionStructure newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CommissionStructure query()
 * @method static \Illuminate\Database\Eloquent\Builder|CommissionStructure whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CommissionStructure whereFixedValuePerCard($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CommissionStructure whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CommissionStructure whereLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CommissionStructure wherePercentageValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CommissionStructure whereUpdatedAt($value)
 */
	class CommissionStructure extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Country
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $phone_code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property bool $is_enabled
 * @property-read \App\Models\ShippingMatrix|null $shippingMatrix
 * @method static \Illuminate\Database\Eloquent\Builder|Country enabled()
 * @method static \Database\Factories\CountryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Country newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Country newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Country query()
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereIsEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country wherePhoneCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereUpdatedAt($value)
 */
	class Country extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Coupon
 *
 * @property int $id
 * @property int $created_by
 * @property int $coupon_status_id current status
 * @property string $code
 * @property string|null $name
 * @property string|null $description
 * @property float|null $max_usage_allowed
 * @property float|null $usage_allowed_per_user
 * @property $type 0 => percentage, 1 => fixed
 * @property string $discount_value
 * @property bool $is_capped
 * @property float|null $capped_amount
 * @property \App\Enums\Coupon\CouponMinThresholdTypeEnum $min_threshold_type 0 => No threshold, 1 => card count, 2 => amount
 * @property int $min_threshold_value when 0 it means no threshold
 * @property int|null $max_discount_applicable_items
 * @property int $is_system_generated
 * @property $available_from
 * @property |null $available_till if its null then the coupon is permanent
 * @property int $coupon_applicable_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Couponable|null $couponAble
 * @property-read \App\Models\CouponApplicable $couponApplicable
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CouponLog> $couponLogs
 * @property-read int|null $coupon_logs_count
 * @property-read \App\Models\CouponStat|null $couponStats
 * @property-read \App\Models\CouponStatus $couponStatus
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CouponStatusHistory> $couponStatusHistories
 * @property-read int|null $coupon_status_histories_count
 * @property-read \App\Models\User $createdBy
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PaymentPlan> $paymentPlans
 * @property-read int|null $payment_plans_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon excludeSystemGeneratedCoupons()
 * @method static \Database\Factories\CouponFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon isActive()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon notCreatedBy(string|int $id)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon query()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon status(string|int $status)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon validForUserLimit(string $couponCode, \App\Models\User $user)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon validOnCouponable(array $couponParams)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon validOnCurrentDate()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereAvailableFrom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereAvailableTill($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereCappedAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereCouponApplicableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereCouponStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereDiscountValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereIsCapped($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereIsSystemGenerated($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereMaxDiscountApplicableItems($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereMaxUsageAllowed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereMinThresholdType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereMinThresholdValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereUsageAllowedPerUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon withoutTrashed()
 */
	class Coupon extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CouponApplicable
 *
 * @property int $id
 * @property string $code
 * @property string $label
 * @property string|null $description
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Coupon> $coupons
 * @property-read int|null $coupons_count
 * @method static \Database\Factories\CouponApplicableFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable onlyActive()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable query()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponApplicable whereUpdatedAt($value)
 */
	class CouponApplicable extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CouponLog
 *
 * @property int $id
 * @property int $coupon_id
 * @property int $order_id
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Coupon $coupon
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\CouponLogFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CouponLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponLog query()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponLog whereCouponId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponLog whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponLog whereUserId($value)
 */
	class CouponLog extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CouponStat
 *
 * @property int $id
 * @property int $coupon_id
 * @property int $times_used
 * @property int $total_cards
 * @property string $total_discount
 * @property string $total_revenue
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Coupon $coupon
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat query()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat whereCouponId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat whereTimesUsed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat whereTotalCards($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat whereTotalDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat whereTotalRevenue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStat whereUpdatedAt($value)
 */
	class CouponStat extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CouponStatus
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CouponStatusHistory> $couponStatusHistories
 * @property-read int|null $coupon_status_histories_count
 * @method static \Database\Factories\CouponStatusFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatus forStatus(string|int $status)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatus whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatus whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatus whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatus whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatus whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatus whereUpdatedAt($value)
 */
	class CouponStatus extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CouponStatusHistory
 *
 * @property int $id
 * @property int $coupon_id
 * @property int $coupon_status_id
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Coupon $coupon
 * @property-read \App\Models\CouponStatus $couponStatus
 * @method static \Database\Factories\CouponStatusHistoryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatusHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatusHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatusHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatusHistory whereCouponId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatusHistory whereCouponStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatusHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatusHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatusHistory whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CouponStatusHistory whereUpdatedAt($value)
 */
	class CouponStatusHistory extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Couponable
 *
 * @property int $id
 * @property int $coupon_id
 * @property string $couponables_type
 * @property int $couponables_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\CouponableFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Couponable newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Couponable newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Couponable query()
 * @method static \Illuminate\Database\Eloquent\Builder|Couponable whereCouponId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Couponable whereCouponablesId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Couponable whereCouponablesType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Couponable whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Couponable whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Couponable whereUpdatedAt($value)
 */
	class Couponable extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\CustomerAddress
 *
 * @property int $id
 * @property int $user_id
 * @property string $first_name
 * @property string $last_name
 * @property string $address
 * @property string|null $address_2
 * @property string $city
 * @property string $state
 * @property string $zip
 * @property string $phone
 * @property string|null $flat
 * @property int $country_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Country $country
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\CustomerAddressFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress forUser(\App\Models\User $user)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress query()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereAddress2($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereCountryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereFlat($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereState($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereZip($value)
 */
	class CustomerAddress extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\DatabaseNotification
 *
 * @property string $id
 * @property string $type
 * @property string $notifiable_type
 * @property int $notifiable_id
 * @property array $data
 * @property \Illuminate\Support\Carbon|null $read_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $notifiable
 * @method static \Illuminate\Notifications\DatabaseNotificationCollection<int, static> all($columns = ['*'])
 * @method static \Database\Factories\DatabaseNotificationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Notifications\DatabaseNotificationCollection<int, static> get($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification query()
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification read()
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification unread()
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification whereNotifiableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification whereNotifiableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification whereReadAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DatabaseNotification whereUpdatedAt($value)
 */
	class DatabaseNotification extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\HubspotDeal
 *
 * @property int $id
 * @property string $deal_name
 * @property string $deal_id
 * @property string $user_email
 * @property string $owner_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|HubspotDeal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|HubspotDeal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|HubspotDeal query()
 * @method static \Illuminate\Database\Eloquent\Builder|HubspotDeal whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HubspotDeal whereDealId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HubspotDeal whereDealName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HubspotDeal whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HubspotDeal whereOwnerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HubspotDeal whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|HubspotDeal whereUserEmail($value)
 */
	class HubspotDeal extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Invoice
 *
 * @property int $id
 * @property string $invoice_number
 * @property string $path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\InvoiceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice query()
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereInvoiceNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereUpdatedAt($value)
 */
	class Invoice extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\MailchimpList
 *
 * @property int $id
 * @property string $list_name
 * @property string $list_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|MailchimpList newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MailchimpList newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MailchimpList query()
 * @method static \Illuminate\Database\Eloquent\Builder|MailchimpList whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MailchimpList whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MailchimpList whereListId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MailchimpList whereListName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MailchimpList whereUpdatedAt($value)
 */
	class MailchimpList extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Order
 *
 * @property int $id
 * @property string|null $order_number
 * @property \App\Enums\Order\OrderStepEnum $order_step
 * @property float|null $service_fee
 * @property float|null $shipping_fee
 * @property float $cleaning_fee
 * @property float $signature_fee
 * @property float $shipping_insurance_fee
 * @property float|null $grand_total
 * @property float|null $amount_paid_from_wallet
 * @property string|null $grand_total_before_discount
 * @property float|null $discounted_amount
 * @property float|null $payment_method_discounted_amount
 * @property float $extra_charge_total This will hold the cumulative value of all the extra charges per order
 * @property float $refund_total This will hold the cumulative value of all the refunds per order
 * @property int $user_id
 * @property int $payment_plan_id
 * @property int $order_payment_plan_id
 * @property int|null $order_status_id
 * @property \App\Enums\Order\OrderPaymentStatusEnum $payment_status 0 => pending payment, 1 => paid
 * @property int|null $shipping_order_address_id
 * @property int|null $billing_order_address_id
 * @property int|null $payment_method_id
 * @property int|null $shipping_method_id
 * @property int|null $coupon_id
 * @property int|null $invoice_id
 * @property int|null $order_shipment_id
 * @property int|null $order_customer_shipment_id
 * @property int|null $salesman_id
 * @property float $referral_total_commission
 * @property bool $requires_cleaning Refers to card cleaning service
 * @property bool $requires_signature Refers to signature at delivery service
 * @property bool $requires_shipping_insurance Shows if Full Shipping Insurance has been selected
 * @property string|null $auto_saved_at
 * @property \Illuminate\Support\Carbon|null $arrived_at
 * @property \Illuminate\Support\Carbon|null $estimated_delivery_start_at
 * @property \Illuminate\Support\Carbon|null $estimated_delivery_end_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $notes
 * @property int|null $created_by
 * @property int|null $reviewed_by_id
 * @property int|null $graded_by_id
 * @property \Illuminate\Support\Carbon|null $reviewed_at
 * @property \Illuminate\Support\Carbon|null $graded_at
 * @property \Illuminate\Support\Carbon|null $shipped_at
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property string|null $salesman_commission
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Activitylog\Models\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderPayment> $allPayments
 * @property-read int|null $all_payments_count
 * @property-read \App\Models\OrderAddress|null $billingAddress
 * @property-read \App\Models\Coupon|null $coupon
 * @property-read \App\Models\User|null $createdBy
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderPayment> $extraCharges
 * @property-read int|null $extra_charges_count
 * @property-read \App\Models\OrderPayment|null $firstOrderPayment
 * @property-read int $grand_total_cents
 * @property-read float $grand_total_to_be_paid
 * @property-read \App\Models\User|null $gradedBy
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $gradedOrderItems
 * @property-read int|null $graded_order_items_count
 * @property-read \App\Models\Invoice|null $invoice
 * @property-read \App\Models\OrderPayment|null $lastOrderPayment
 * @property-read \App\Models\OrderCertificate|null $orderCertificate
 * @property-read \App\Models\OrderCustomerShipment|null $orderCustomerShipment
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $orderItems
 * @property-read int|null $order_items_count
 * @property-read \App\Models\OrderLabel|null $orderLabel
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderPayment> $orderPayments
 * @property-read int|null $order_payments_count
 * @property-read \App\Models\OrderShipment|null $orderShipment
 * @property-read \App\Models\OrderStatus|null $orderStatus
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderStatusHistory> $orderStatusHistory
 * @property-read int|null $order_status_history_count
 * @property-read \App\Models\PaymentPlan $originalPaymentPlan
 * @property-read \App\Models\PaymentMethod|null $paymentMethod
 * @property-read \App\Models\OrderPaymentPlan $paymentPlan
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderPayment> $refunds
 * @property-read int|null $refunds_count
 * @property-read \App\Models\User|null $reviewedBy
 * @property-read \App\Models\User|null $salesman
 * @property \Illuminate\Database\Eloquent\Collection<int, \Spatie\Tags\Tag> $tags
 * @property-read \App\Models\OrderAddress|null $shippingAddress
 * @property-read \App\Models\ShippingMethod|null $shippingMethod
 * @property-read int|null $tags_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|Order betweenDates(\DateTime $fromDate, \DateTime $toDate)
 * @method static \Illuminate\Database\Eloquent\Builder|Order couponCode(string $coupon)
 * @method static \Illuminate\Database\Eloquent\Builder|Order customerId(string $customerId)
 * @method static \Illuminate\Database\Eloquent\Builder|Order customerName(string $customerName)
 * @method static \Illuminate\Database\Eloquent\Builder|Order excludeCancelled()
 * @method static \Database\Factories\OrderFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Order forDate(string $date)
 * @method static \Illuminate\Database\Eloquent\Builder|Order forMonth(string $date)
 * @method static \Illuminate\Database\Eloquent\Builder|Order forSalesman(\App\Models\User $user)
 * @method static \Illuminate\Database\Eloquent\Builder|Order forUser(\App\Models\User $user)
 * @method static \Illuminate\Database\Eloquent\Builder|Order newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Order newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Order paid()
 * @method static \Illuminate\Database\Eloquent\Builder|Order placed()
 * @method static \Illuminate\Database\Eloquent\Builder|Order query()
 * @method static \Illuminate\Database\Eloquent\Builder|Order salesmanId(string|int $salesmanId)
 * @method static \Illuminate\Database\Eloquent\Builder|Order status(string|int $status)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereAmountPaidFromWallet($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereArrivedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereAutoSavedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereBillingOrderAddressId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCleaningFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCouponId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereDiscountedAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereEstimatedDeliveryEndAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereEstimatedDeliveryStartAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereExtraChargeTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereGradedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereGradedById($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereGrandTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereGrandTotalBeforeDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereInvoiceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereOrderCustomerShipmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereOrderNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereOrderPaymentPlanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereOrderShipmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereOrderStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereOrderStep($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaidAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaymentMethodDiscountedAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaymentMethodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaymentPlanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaymentStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereReferralTotalCommission($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereRefundTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereRequiresCleaning($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereRequiresShippingInsurance($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereRequiresSignature($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereReviewedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereReviewedById($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereSalesmanCommission($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereSalesmanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereServiceFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippingFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippingInsuranceFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippingMethodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippingOrderAddressId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereSignatureFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order withAllTags(\ArrayAccess|\Spatie\Tags\Tag|array|string $tags, ?string $type = null)
 * @method static \Illuminate\Database\Eloquent\Builder|Order withAllTagsOfAnyType($tags)
 * @method static \Illuminate\Database\Eloquent\Builder|Order withAnyTags(\ArrayAccess|\Spatie\Tags\Tag|array|string $tags, ?string $type = null)
 * @method static \Illuminate\Database\Eloquent\Builder|Order withAnyTagsOfAnyType($tags)
 * @method static \Illuminate\Database\Eloquent\Builder|Order withoutTags(\ArrayAccess|\Spatie\Tags\Tag|array|string $tags, ?string $type = null)
 */
	class Order extends \Eloquent implements \App\Contracts\Exportable, \App\Contracts\Taggable {}
}

namespace App\Models{
/**
 * App\Models\OrderAddress
 *
 * @property int $id
 * @property string $first_name
 * @property string $last_name
 * @property string $address
 * @property string|null $address_2
 * @property string $city
 * @property string $state
 * @property string $zip
 * @property string $phone
 * @property string|null $flat
 * @property int $country_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Country $country
 * @method static \Database\Factories\OrderAddressFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereAddress2($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereCountryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereFlat($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereState($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereZip($value)
 */
	class OrderAddress extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderCertificate
 *
 * @property int $id
 * @property int $order_id
 * @property string $path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCertificate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCertificate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCertificate query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCertificate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCertificate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCertificate whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCertificate wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCertificate whereUpdatedAt($value)
 */
	class OrderCertificate extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderCustomerShipment
 *
 * @property int $id
 * @property string|null $shipment_date
 * @property string $tracking_number
 * @property string|null $tracking_url
 * @property string $shipping_provider
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Order|null $order
 * @method static \Database\Factories\OrderCustomerShipmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCustomerShipment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCustomerShipment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCustomerShipment query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCustomerShipment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCustomerShipment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCustomerShipment whereShipmentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCustomerShipment whereShippingProvider($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCustomerShipment whereTrackingNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCustomerShipment whereTrackingUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderCustomerShipment whereUpdatedAt($value)
 */
	class OrderCustomerShipment extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderItem
 *
 * @property int $id
 * @property int $order_id
 * @property int $card_product_id
 * @property int|null $order_item_shipment_id
 * @property int $quantity
 * @property float $declared_value_per_unit
 * @property float $declared_value_total
 * @property string|null $name
 * @property string|null $description
 * @property string|null $notes
 * @property string|null $internal_notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $order_item_customer_shipment_id
 * @property int $order_item_status_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Activitylog\Models\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\CardProduct $cardProduct
 * @property-read \App\Models\OrderItemStatusHistory|null $latestOrderItemStatusHistory
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\OrderItemCustomerShipment|null $orderItemCustomerShipment
 * @property-read \App\Models\OrderItemShipment|null $orderItemShipment
 * @property-read \App\Models\OrderItemStatus $orderItemStatus
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItemStatusHistory> $orderItemStatusHistory
 * @property-read int|null $order_item_status_history_count
 * @property-read \App\Models\UserCard|null $userCard
 * @method static \Database\Factories\OrderItemFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereCardProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereDeclaredValuePerUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereDeclaredValueTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereInternalNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereOrderItemCustomerShipmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereOrderItemShipmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereOrderItemStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem whereUpdatedAt($value)
 */
	class OrderItem extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderItemCustomerShipment
 *
 * @property int $id
 * @property string|null $shipment_date
 * @property string $tracking_number
 * @property string $shipping_provider
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\OrderItemCustomerShipmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemCustomerShipment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemCustomerShipment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemCustomerShipment query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemCustomerShipment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemCustomerShipment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemCustomerShipment whereShipmentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemCustomerShipment whereShippingProvider($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemCustomerShipment whereTrackingNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemCustomerShipment whereUpdatedAt($value)
 */
	class OrderItemCustomerShipment extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderItemShipment
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $shipment_date
 * @property string $tracking_number
 * @property string|null $tracking_url
 * @property string|null $shipping_provider
 * @property int $shipping_method_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\ShippingMethod $shippingMethod
 * @method static \Database\Factories\OrderItemShipmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment whereShipmentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment whereShippingMethodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment whereShippingProvider($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment whereTrackingNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment whereTrackingUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemShipment whereUpdatedAt($value)
 */
	class OrderItemShipment extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderItemStatus
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\OrderItemStatusFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatus forStatus($status)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatus whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatus whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatus whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatus whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatus whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatus whereUpdatedAt($value)
 */
	class OrderItemStatus extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderItemStatusHistory
 *
 * @property int $id
 * @property int $order_item_status_id
 * @property int $order_item_id
 * @property int|null $user_id
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Activitylog\Models\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\OrderItem $orderItem
 * @property-read \App\Models\OrderItemStatus $orderItemStatus
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\OrderItemStatusHistoryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatusHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatusHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatusHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatusHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatusHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatusHistory whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatusHistory whereOrderItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatusHistory whereOrderItemStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatusHistory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItemStatusHistory whereUserId($value)
 */
	class OrderItemStatusHistory extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderLabel
 *
 * @property int $id
 * @property int $order_id
 * @property string $path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Order $order
 * @method static \Illuminate\Database\Eloquent\Builder|OrderLabel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderLabel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderLabel query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderLabel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderLabel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderLabel whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderLabel wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderLabel whereUpdatedAt($value)
 */
	class OrderLabel extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderPayment
 *
 * @property int $id
 * @property int $order_id
 * @property int|null $payment_method_id
 * @property string|null $request
 * @property string|null $response
 * @property string|null $payment_provider_reference_id
 * @property string|null $notes
 * @property float|null $amount
 * @property int $type 1 => order payment, 2 => extra charge, 3 => refund
 * @property float|null $provider_fee
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id Person who made the transaction, can be a user himself or an admin
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Activitylog\Models\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\PaymentMethod|null $paymentMethod
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\OrderPaymentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment forMonth(string $date)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment forValidPaidOrders()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment ignoreOrdersBySpecificAdmins()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment wherePaymentMethodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment wherePaymentProviderReferenceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereProviderFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereRequest($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereResponse($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment whereUserId($value)
 */
	class OrderPayment extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderPaymentPlan
 *
 * @property int $id
 * @property float $price
 * @property float $max_protection_amount
 * @property string $turnaround
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Order|null $order
 * @method static \Database\Factories\OrderPaymentPlanFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPaymentPlan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPaymentPlan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPaymentPlan query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPaymentPlan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPaymentPlan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPaymentPlan whereMaxProtectionAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPaymentPlan wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPaymentPlan whereTurnaround($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPaymentPlan whereUpdatedAt($value)
 */
	class OrderPaymentPlan extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderShipment
 *
 * @property int $id
 * @property string|null $shipment_date
 * @property string $tracking_number
 * @property string|null $tracking_url
 * @property string $shipping_provider
 * @property int $shipping_method_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Activitylog\Models\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\Order|null $order
 * @property-read \App\Models\ShippingMethod $shippingMethod
 * @method static \Database\Factories\OrderShipmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment whereShipmentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment whereShippingMethodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment whereShippingProvider($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment whereTrackingNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment whereTrackingUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderShipment whereUpdatedAt($value)
 */
	class OrderShipment extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderState
 *
 * @property int $id
 * @property string $code
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\OrderStateFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderState newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderState newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderState query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderState whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderState whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderState whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderState whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderState whereUpdatedAt($value)
 */
	class OrderState extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderStatus
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $description
 * @property int $order_state_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\OrderState $orderState
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderStatusHistory> $orderStatusHistories
 * @property-read int|null $order_status_histories_count
 * @method static \Database\Factories\OrderStatusFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatus whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatus whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatus whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatus whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatus whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatus whereOrderStateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatus whereUpdatedAt($value)
 */
	class OrderStatus extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderStatusHistory
 *
 * @property int $id
 * @property int $order_id
 * @property int $order_status_id
 * @property int $user_id
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Activitylog\Models\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\OrderStatus $orderStatus
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\OrderStatusHistoryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatusHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatusHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatusHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatusHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatusHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatusHistory whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatusHistory whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatusHistory whereOrderStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatusHistory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderStatusHistory whereUserId($value)
 */
	class OrderStatusHistory extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PaymentMethod
 *
 * @property int $id
 * @property string $name
 * @property string $code
 * @property int $is_enabled
 * @property int $is_visible
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $handles_handshake
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod enabled()
 * @method static \Database\Factories\PaymentMethodFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod query()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod visible()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereHandlesHandshake($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereIsEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereIsVisible($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereUpdatedAt($value)
 */
	class PaymentMethod extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PaymentPlan
 *
 * @property int $id
 * @property float $price
 * @property float|null $price_before_discount It can be used to show a pre-discount price.
 * @property string|null $discount_percentage
 * @property float $max_protection_amount
 * @property string $turnaround
 * @property int|null $estimated_delivery_days_min
 * @property int|null $estimated_delivery_days_max
 * @property int $display_position
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Coupon> $coupons
 * @property-read int|null $coupons_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\PaymentPlanRange> $paymentPlanRanges
 * @property-read int|null $payment_plan_ranges_count
 * @method static \Database\Factories\PaymentPlanFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan query()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereDiscountPercentage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereDisplayPosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereEstimatedDeliveryDaysMax($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereEstimatedDeliveryDaysMin($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereMaxProtectionAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan wherePriceBeforeDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereTurnaround($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan withoutTrashed()
 */
	class PaymentPlan extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PaymentPlanRange
 *
 * @property int $id
 * @property int $payment_plan_id
 * @property int $min_cards
 * @property int|null $max_cards
 * @property float $price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\PaymentPlan $paymentPlan
 * @method static \Database\Factories\PaymentPlanRangeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlanRange newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlanRange newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlanRange query()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlanRange whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlanRange whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlanRange whereMaxCards($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlanRange whereMinCards($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlanRange wherePaymentPlanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlanRange wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlanRange whereUpdatedAt($value)
 */
	class PaymentPlanRange extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PopReportsCard
 *
 * @property int $id
 * @property int $card_set_id
 * @property int $card_product_id
 * @property int $pr
 * @property int $fr
 * @property int $good
 * @property int $good_plus
 * @property int $vg
 * @property int $vg_plus
 * @property int $vg_ex
 * @property int $vg_ex_plus
 * @property int $ex
 * @property int $ex_plus
 * @property int $ex_mt
 * @property int $ex_mt_plus
 * @property int $nm
 * @property int $nm_plus
 * @property int $nm_mt
 * @property int $nm_mt_plus
 * @property int $mint
 * @property int $mint_plus
 * @property int $gem_mt
 * @property int $total
 * @property int $total_plus
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $population
 * @property-read \App\Models\CardProduct $cardProduct
 * @method static \Database\Factories\PopReportsCardFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard query()
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereCardProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereCardSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereEx($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereExMt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereExMtPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereExPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereFr($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereGemMt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereGood($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereGoodPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereMint($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereMintPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereNm($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereNmMt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereNmMtPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereNmPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard wherePopulation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard wherePr($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereTotalPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereVg($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereVgEx($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereVgExPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsCard whereVgPlus($value)
 */
	class PopReportsCard extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PopReportsSeries
 *
 * @property int $id
 * @property int $card_series_id
 * @property int $pr
 * @property int $fr
 * @property int $good
 * @property int $good_plus
 * @property int $vg
 * @property int $vg_plus
 * @property int $vg_ex
 * @property int $vg_ex_plus
 * @property int $ex
 * @property int $ex_plus
 * @property int $ex_mt
 * @property int $ex_mt_plus
 * @property int $nm
 * @property int $nm_plus
 * @property int $nm_mt
 * @property int $nm_mt_plus
 * @property int $mint
 * @property int $mint_plus
 * @property int $gem_mt
 * @property int $total
 * @property int $total_plus
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CardSeries|null $cardSeries
 * @method static \Database\Factories\PopReportsSeriesFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries query()
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereCardSeriesId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereEx($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereExMt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereExMtPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereExPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereFr($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereGemMt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereGood($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereGoodPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereMint($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereMintPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereNm($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereNmMt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereNmMtPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereNmPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries wherePr($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereTotalPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereVg($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereVgEx($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereVgExPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSeries whereVgPlus($value)
 */
	class PopReportsSeries extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\PopReportsSet
 *
 * @property int $id
 * @property int $card_series_id
 * @property int $card_set_id
 * @property int $pr
 * @property int $fr
 * @property int $good
 * @property int $good_plus
 * @property int $vg
 * @property int $vg_plus
 * @property int $vg_ex
 * @property int $vg_ex_plus
 * @property int $ex
 * @property int $ex_plus
 * @property int $ex_mt
 * @property int $ex_mt_plus
 * @property int $nm
 * @property int $nm_plus
 * @property int $nm_mt
 * @property int $nm_mt_plus
 * @property int $mint
 * @property int $mint_plus
 * @property int $gem_mt
 * @property int $total
 * @property int $total_plus
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CardSet $cardSet
 * @method static \Database\Factories\PopReportsSetFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet query()
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereCardSeriesId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereCardSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereEx($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereExMt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereExMtPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereExPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereFr($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereGemMt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereGood($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereGoodPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereMint($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereMintPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereNm($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereNmMt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereNmMtPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereNmPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet wherePr($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereTotalPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereVg($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereVgEx($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereVgExPlus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PopReportsSet whereVgPlus($value)
 */
	class PopReportsSet extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Referrer
 *
 * @property int $id
 * @property int $user_id
 * @property string $referral_code
 * @property float $withdrawable_commission
 * @property int $link_clicks
 * @property int $successful_signups
 * @property int $referral_orders The total amount of paid orders done by referred users
 * @property int $is_referral_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ReferrerEarnedCommission> $earnedCommissions
 * @property-read int|null $earned_commissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $referees
 * @property-read int|null $referees_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ReferrerFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer query()
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer whereIsReferralActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer whereLinkClicks($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer whereReferralCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer whereReferralOrders($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer whereSuccessfulSignups($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Referrer whereWithdrawableCommission($value)
 */
	class Referrer extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ReferrerEarnedCommission
 *
 * @property int $id
 * @property int $referrer_id
 * @property int $order_id
 * @property int $commission_structure_id
 * @property int $type 1 => Order Paid, 2 => Order Refunded, 3 => Extra Charge
 * @property float $commission
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CommissionStructure|null $commissionStructure
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\Referrer|null $referrer
 * @method static \Database\Factories\ReferrerEarnedCommissionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission query()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission whereCommission($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission whereCommissionStructureId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission whereReferrerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerEarnedCommission whereUpdatedAt($value)
 */
	class ReferrerEarnedCommission extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ReferrerPayout
 *
 * @property int $id
 * @property int $user_id
 * @property string $payout_account
 * @property string $payment_method
 * @property string $amount
 * @property string|null $initiated_at
 * @property string|null $completed_at
 * @property string|null $response_payload
 * @property string|null $request_payload
 * @property int $referrer_payout_status_id
 * @property int|null $paid_by
 * @property string|null $transaction_id
 * @property string|null $transaction_status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $paidBy
 * @property-read \App\Models\ReferrerPayoutStatus $referrerPayoutStatus
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ReferrerPayoutFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout forUser(\App\Models\User $user)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout query()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereInitiatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout wherePaidBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout wherePayoutAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereReferrerPayoutStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereRequestPayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereResponsePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereTransactionStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayout whereUserId($value)
 */
	class ReferrerPayout extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ReferrerPayoutStatus
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayoutStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayoutStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayoutStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayoutStatus whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayoutStatus whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayoutStatus whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayoutStatus whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayoutStatus whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ReferrerPayoutStatus whereUpdatedAt($value)
 */
	class ReferrerPayoutStatus extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\RevenueStatsDaily
 *
 * @property int $id
 * @property string $event_at
 * @property float $revenue
 * @property float $profit
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsDaily newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsDaily newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsDaily query()
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsDaily whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsDaily whereEventAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsDaily whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsDaily whereProfit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsDaily whereRevenue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsDaily whereUpdatedAt($value)
 */
	class RevenueStatsDaily extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\RevenueStatsMonthly
 *
 * @property int $id
 * @property string $event_at
 * @property float $revenue
 * @property float $profit
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsMonthly newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsMonthly newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsMonthly query()
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsMonthly whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsMonthly whereEventAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsMonthly whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsMonthly whereProfit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsMonthly whereRevenue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|RevenueStatsMonthly whereUpdatedAt($value)
 */
	class RevenueStatsMonthly extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Salesman
 *
 * @property int $id
 * @property int $user_id
 * @property \App\Enums\Salesman\CommissionTypeEnum $commission_type 0 => percentage, 1 => fixed
 * @property string $commission_value
 * @property int|null $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SalesmanEarnedCommission> $salesmanEarnedCommissions
 * @property-read int|null $salesman_earned_commissions_count
 * @method static \Illuminate\Database\Eloquent\Builder|Salesman newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Salesman newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Salesman query()
 * @method static \Illuminate\Database\Eloquent\Builder|Salesman whereCommissionType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salesman whereCommissionValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salesman whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salesman whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salesman whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salesman whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salesman whereUserId($value)
 */
	class Salesman extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\SalesmanCommission
 *
 * @property int $id
 * @property int $salesman_id
 * @property string $event_at
 * @property string $commission
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommission query()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommission whereCommission($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommission whereEventAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommission whereSalesmanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommission whereUpdatedAt($value)
 */
	class SalesmanCommission extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\SalesmanCommissionPayment
 *
 * @property int $id
 * @property int $salesman_id
 * @property int $added_by_id
 * @property string $amount
 * @property string|null $file_url
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $addedBy
 * @property-read \App\Models\User $salesman
 * @method static \Database\Factories\SalesmanCommissionPaymentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment query()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment whereAddedById($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment whereFileUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment whereSalesmanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanCommissionPayment whereUpdatedAt($value)
 */
	class SalesmanCommissionPayment extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\SalesmanEarnedCommission
 *
 * @property int $id
 * @property int $salesman_id
 * @property int|null $order_id
 * @property int $type 1 => Order Created, 2 => Order Refunded
 * @property string $commission
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanEarnedCommission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanEarnedCommission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanEarnedCommission query()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanEarnedCommission whereCommission($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanEarnedCommission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanEarnedCommission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanEarnedCommission whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanEarnedCommission whereSalesmanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanEarnedCommission whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesmanEarnedCommission whereUpdatedAt($value)
 */
	class SalesmanEarnedCommission extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ScheduledEmail
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $send_at
 * @property string $payload
 * @property bool $is_sent
 * @property bool $rescheduling_required Decides if this scheduled email needs rescheduling
 * @property string|null $check_class Class which decides further sending and rescheduling
 * @property string|null $extra_data Extra data if needed in check class
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\ScheduledEmailFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail query()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereCheckClass($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereExtraData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereIsSent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereReschedulingRequired($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereSendAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereUpdatedAt($value)
 */
	class ScheduledEmail extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ScheduledNotification
 *
 * @property int $id
 * @property string|null $notification_class
 * @property string $notifiable_type
 * @property int $notifiable_id
 * @property \Illuminate\Support\Carbon $send_at
 * @property string $payload
 * @property int $is_sent
 * @property string|null $check_class
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $notifiable
 * @method static \Database\Factories\ScheduledNotificationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification query()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification unsent()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification whereCheckClass($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification whereIsSent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification whereNotifiableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification whereNotifiableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification whereNotificationClass($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification whereSendAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledNotification whereUpdatedAt($value)
 */
	class ScheduledNotification extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ShippingMatrix
 *
 * @property int $id
 * @property int $country_id
 * @property float|null $box_default_value
 * @property float|null $slip_default_value
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Country $country
 * @method static \Database\Factories\ShippingMatrixFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMatrix newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMatrix newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMatrix query()
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMatrix whereBoxDefaultValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMatrix whereCountryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMatrix whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMatrix whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMatrix whereSlipDefaultValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMatrix whereUpdatedAt($value)
 */
	class ShippingMatrix extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ShippingMethod
 *
 * @property int $id
 * @property string $name
 * @property string $code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\ShippingMethodFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMethod newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMethod newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMethod query()
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMethod whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMethod whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMethod whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMethod whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ShippingMethod whereUpdatedAt($value)
 */
	class ShippingMethod extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\State
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property int $country_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Country $country
 * @method static \Database\Factories\StateFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|State newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|State newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|State query()
 * @method static \Illuminate\Database\Eloquent\Builder|State whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|State whereCountryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|State whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|State whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|State whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|State whereUpdatedAt($value)
 */
	class State extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property-read int $paid_orders_count
 * @property-read int $order_items_sum_quantity
 * @property int $id
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string|null $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $username
 * @property string $password
 * @property string|null $phone
 * @property bool|null $is_active
 * @property string|null $profile_image
 * @property string|null $remember_token
 * @property mixed|null $ags_access_token
 * @property int|null $salesman_id
 * @property int|null $referred_by
 * @property int|null $created_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $last_login_at
 * @property string|null $stripe_id
 * @property string|null $pm_type
 * @property string|null $pm_last_four
 * @property string|null $customer_number
 * @property bool $is_marketing_notifications_enabled
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Coupon> $coupons
 * @property-read int|null $coupons_count
 * @property-read User|null $createdBy
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CustomerAddress> $customerAddresses
 * @property-read int|null $customer_addresses_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UserDevice> $devices
 * @property-read int|null $devices_count
 * @property-read string $name
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\OrderItem> $orderItems
 * @property-read int|null $order_items_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Order> $orders
 * @property-read int|null $orders_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, User> $referees
 * @property-read int|null $referees_count
 * @property-read User|null $referredBy
 * @property-read \App\Models\Referrer|null $referrer
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Role> $roles
 * @property-read int|null $roles_count
 * @property-read User|null $salesman
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SalesmanCommissionPayment> $salesmanCommissionPayments
 * @property-read int|null $salesman_commission_payments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Order> $salesmanOrders
 * @property-read int|null $salesman_orders_count
 * @property-read \App\Models\Salesman|null $salesmanProfile
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Cashier\Subscription> $subscriptions
 * @property-read int|null $subscriptions_count
 * @property-read \App\Models\Wallet|null $wallet
 * @method static \Illuminate\Database\Eloquent\Builder|User admin()
 * @method static \Illuminate\Database\Eloquent\Builder|User customer()
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|User hasExpiredGenericTrial()
 * @method static \Illuminate\Database\Eloquent\Builder|User isActiveSalesman(bool $value)
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User onGenericTrial()
 * @method static \Illuminate\Database\Eloquent\Builder|User onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|User permission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User referrerSignedUpBetween(string $startDate, string $endDate)
 * @method static \Illuminate\Database\Eloquent\Builder|User referrerSubmissions(string $minSubmissionCount, string $maxSubmissionCount)
 * @method static \Illuminate\Database\Eloquent\Builder|User role($roles, $guard = null)
 * @method static \Illuminate\Database\Eloquent\Builder|User salesmanId(string|int $salesmanId)
 * @method static \Illuminate\Database\Eloquent\Builder|User salesmanSignedUpBetween(string $startDate, string $endDate)
 * @method static \Illuminate\Database\Eloquent\Builder|User salesmen()
 * @method static \Illuminate\Database\Eloquent\Builder|User signedUpBetween(string $startDate, string $endDate)
 * @method static \Illuminate\Database\Eloquent\Builder|User submissions(string $minSubmissionCount, string $maxSubmissionCount)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereAgsAccessToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCustomerNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereIsMarketingNotificationsEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLastLoginAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePmLastFour($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePmType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereProfileImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereReferredBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereSalesmanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereStripeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUsername($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|User withoutTrashed()
 */
	class User extends \Eloquent implements \App\Contracts\Exportable, \App\Contracts\ExportableWithSort, \Filament\Models\Contracts\FilamentUser, \Filament\Models\Contracts\HasAvatar, \Tymon\JWTAuth\Contracts\JWTSubject {}
}

namespace App\Models{
/**
 * App\Models\UserCard
 *
 * @property int $id
 * @property int $order_item_id
 * @property int $user_id
 * @property array|null $human_grade_values
 * @property array|null $robo_grade_values
 * @property array|null $overall_values
 * @property float|null $overall_grade
 * @property string|null $overall_grade_nickname
 * @property string|null $grading_id
 * @property string|null $certificate_number
 * @property mixed|null $ai_model_numbers
 * @property array|null $generated_images
 * @property \App\Enums\UserCard\UserCardShippingStatus|null $shipping_status 0 => in vault, 1 => shipping requested, 2 => shipped
 * @property bool|null $is_fake
 * @property array|null $social_images
 * @property array|null $slab_images
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property float|null $grade_delta
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Activitylog\Models\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\OrderItem $orderItem
 * @property-read \App\Models\User $user
 * @property-read \App\Models\UserCardCertificate|null $userCardCertificate
 * @property-read \App\Models\VaultShipmentItem|null $vaultShipmentItem
 * @method static \Database\Factories\UserCardFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard query()
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereAiModelNumbers($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereCertificateNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereGeneratedImages($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereGradeDelta($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereGradingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereHumanGradeValues($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereIsFake($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereOrderItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereOverallGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereOverallGradeNickname($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereOverallValues($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereRoboGradeValues($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereShippingStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereSlabImages($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereSocialImages($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereUserId($value)
 */
	class UserCard extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\UserCardCertificate
 *
 * @property int $id
 * @property int $user_card_id
 * @property string|null $number
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\UserCard $userCard
 * @method static \Database\Factories\UserCardCertificateFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|UserCardCertificate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserCardCertificate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserCardCertificate query()
 * @method static \Illuminate\Database\Eloquent\Builder|UserCardCertificate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCardCertificate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCardCertificate whereNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCardCertificate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCardCertificate whereUserCardId($value)
 */
	class UserCardCertificate extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\UserDevice
 *
 * @property int $id
 * @property int $user_id
 * @property string $platform
 * @property string|null $device_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\UserDeviceFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|UserDevice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserDevice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserDevice query()
 * @method static \Illuminate\Database\Eloquent\Builder|UserDevice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserDevice whereDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserDevice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserDevice wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserDevice whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserDevice whereUserId($value)
 */
	class UserDevice extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\VaultShipment
 *
 * @property int $id
 * @property int $user_id
 * @property int $shipping_address_id
 * @property int $billing_address_id
 * @property int $vault_shipment_status_id
 * @property int|null $coupon_id
 * @property int $shipping_method_id
 * @property string $shipment_number
 * @property string|null $tracking_number
 * @property string|null $tracking_url
 * @property string|null $shipping_provider
 * @property string $shipping_fee
 * @property string $payment_method_discount
 * @property string $amount_paid_from_wallet
 * @property string $discounted_amount
 * @property string $grand_total
 * @property string|null $shipped_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\OrderAddress $billingAddress
 * @property-read \App\Models\Coupon|null $coupon
 * @property-read \App\Models\VaultShipmentPayment|null $firstVaultShipmentPayment
 * @property-read \App\Models\OrderAddress $shippingAddress
 * @property-read \App\Models\ShippingMethod $shippingMethod
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VaultShipmentItem> $vaultShipmentItems
 * @property-read int|null $vault_shipment_items_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VaultShipmentPayment> $vaultShipmentPayments
 * @property-read int|null $vault_shipment_payments_count
 * @property-read \App\Models\VaultShipmentStatus $vaultShipmentStatus
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VaultShipmentStatusHistory> $vaultShipmentStatusHistories
 * @property-read int|null $vault_shipment_status_histories_count
 * @method static \Database\Factories\VaultShipmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment forUser(\App\Models\User $user)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment query()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereAmountPaidFromWallet($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereBillingAddressId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereCouponId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereDiscountedAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereGrandTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment wherePaymentMethodDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereShipmentNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereShippedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereShippingAddressId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereShippingFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereShippingMethodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereShippingProvider($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereTrackingNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereTrackingUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipment whereVaultShipmentStatusId($value)
 */
	class VaultShipment extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\VaultShipmentItem
 *
 * @property int $id
 * @property int $user_card_id
 * @property int $vault_shipment_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\UserCard $userCard
 * @property-read \App\Models\VaultShipment $vaultShipment
 * @method static \Database\Factories\VaultShipmentItemFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentItem whereUserCardId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentItem whereVaultShipmentId($value)
 */
	class VaultShipmentItem extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\VaultShipmentPayment
 *
 * @property int $id
 * @property int $vault_shipment_id
 * @property int $payment_method_id
 * @property string|null $request
 * @property string|null $response
 * @property string|null $payment_provider_reference_id
 * @property string $amount
 * @property string $provider_fee
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\PaymentMethod $paymentMethod
 * @property-read \App\Models\VaultShipment $vaultShipment
 * @method static \Database\Factories\VaultShipmentPaymentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment query()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment wherePaymentMethodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment wherePaymentProviderReferenceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment whereProviderFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment whereRequest($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment whereResponse($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentPayment whereVaultShipmentId($value)
 */
	class VaultShipmentPayment extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\VaultShipmentStatus
 *
 * @property int $id
 * @property string $name
 * @property string $code
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VaultShipmentStatusHistory> $vaultShipmentStatusHistories
 * @property-read int|null $vault_shipment_status_histories_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VaultShipment> $vaultShipments
 * @property-read int|null $vault_shipments_count
 * @method static \Database\Factories\VaultShipmentStatusFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatus whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatus whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatus whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatus whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatus whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatus whereUpdatedAt($value)
 */
	class VaultShipmentStatus extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\VaultShipmentStatusHistory
 *
 * @property int $id
 * @property int $vault_shipment_status_id
 * @property int $vault_shipment_id
 * @property int $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\VaultShipment $vaultShipment
 * @property-read \App\Models\VaultShipmentStatus $vaultShipmentStatus
 * @method static \Database\Factories\VaultShipmentStatusHistoryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatusHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatusHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatusHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatusHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatusHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatusHistory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatusHistory whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatusHistory whereVaultShipmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VaultShipmentStatusHistory whereVaultShipmentStatusId($value)
 */
	class VaultShipmentStatusHistory extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Wallet
 *
 * @property int $id
 * @property int $user_id
 * @property float $balance
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\WalletTransaction|null $lastTransaction
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WalletPayment> $walletPayments
 * @property-read int|null $wallet_payments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WalletTransaction> $walletTransactions
 * @property-read int|null $wallet_transactions_count
 * @method static \Database\Factories\WalletFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet forCurrentUser()
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet isActive()
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet query()
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet whereUserId($value)
 */
	class Wallet extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\WalletPayment
 *
 * @property int $id
 * @property int $payment_method_id
 * @property int $wallet_id
 * @property array|null $request
 * @property array|null $response
 * @property string|null $payment_provider_reference_id
 * @property float $amount
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\PaymentMethod $paymentMethod
 * @property-read \App\Models\Wallet $wallet
 * @method static \Database\Factories\WalletPaymentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment query()
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment wherePaymentMethodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment wherePaymentProviderReferenceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment whereRequest($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment whereResponse($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment whereWalletId($value)
 */
	class WalletPayment extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\WalletTransaction
 *
 * @property int $id
 * @property int $wallet_id
 * @property int $created_by
 * @property int|null $order_id order ID will be available when refund happened or user pay from wallet
 * @property int|null $wallet_payment_id wallet payment ID will be available when user adds amount to wallet
 * @property float $amount
 * @property \App\Enums\Wallet\WalletTransactionType $type 1 => credit, 2 => debit
 * @property \App\Enums\Wallet\WalletTransactionReason $reason 1 => refund, 2 => order_payment, 3 => wallet_payment
 * @property bool $is_success
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Wallet $wallet
 * @method static \Database\Factories\WalletTransactionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction query()
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereIsSuccess($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereWalletId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction whereWalletPaymentId($value)
 */
	class WalletTransaction extends \Eloquent {}
}

