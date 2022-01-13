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
 * App\Models\CardCategory
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\CardProduct[] $cardProducts
 * @property-read int|null $card_products_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\CardSeries[] $cardSeries
 * @property-read int|null $card_series_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\CardSet[] $cardSets
 * @property-read int|null $card_sets_count
 * @method static \Database\Factories\CardCategoryFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardCategory whereUpdatedAt($value)
 */
	class CardCategory extends \Eloquent {}
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
 * @property int $added_manually
 * @property int|null $added_by
 * @property-read \App\Models\User|null $addedBy
 * @property-read \App\Models\CardCategory|null $cardCategory
 * @property-read \App\Models\CardSet|null $cardSet
 * @method static \Database\Factories\CardProductFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct query()
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereAddedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereAddedManually($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardNumberOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardReferenceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardSetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCardUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereEdition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereHoloType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereImageBucketPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereRarity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereSurface($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereVariant($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereVariantCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CardProduct whereVariantName($value)
 */
	class CardProduct extends \Eloquent {}
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
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\CardSet[] $cardSets
 * @property-read int|null $card_sets_count
 * @property-read string $release_date
 * @method static \Database\Factories\CardSeriesFactory factory(...$parameters)
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
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\CardProduct[] $cardProducts
 * @property-read int|null $card_products_count
 * @property-read \App\Models\CardSeries $cardSeries
 * @method static \Database\Factories\CardSetFactory factory(...$parameters)
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
 * App\Models\Country
 *
 * @property int $id
 * @property string $code
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\CountryFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Country newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Country newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Country query()
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Country whereName($value)
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
 * @property $available_from
 * @property |null $available_till if its null then the coupon is permanent
 * @property int $coupon_applicable_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Couponable|null $couponAble
 * @property-read \App\Models\CouponApplicable $couponApplicable
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\CouponLog[] $couponLogs
 * @property-read int|null $coupon_logs_count
 * @property-read \App\Models\CouponStat|null $couponStats
 * @property-read \App\Models\CouponStatus $couponStatus
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\CouponStatusHistory[] $couponStatusHistories
 * @property-read int|null $coupon_status_histories_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\PaymentPlan[] $paymentPlans
 * @property-read int|null $payment_plans_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\User[] $users
 * @property-read int|null $users_count
 * @method static \Database\Factories\CouponFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon isActive()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon newQuery()
 * @method static \Illuminate\Database\Query\Builder|Coupon onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon query()
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon status(string|int $status)
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
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereMaxUsageAllowed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Coupon whereUsageAllowedPerUser($value)
 * @method static \Illuminate\Database\Query\Builder|Coupon withTrashed()
 * @method static \Illuminate\Database\Query\Builder|Coupon withoutTrashed()
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
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Coupon[] $coupons
 * @property-read int|null $coupons_count
 * @method static \Database\Factories\CouponApplicableFactory factory(...$parameters)
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
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\CouponStatusHistory[] $couponStatusHistories
 * @property-read int|null $coupon_status_histories_count
 * @method static \Database\Factories\CouponStatusFactory factory(...$parameters)
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
 * @method static \Database\Factories\CouponStatusHistoryFactory factory(...$parameters)
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
 * @method static \Database\Factories\CouponableFactory factory(...$parameters)
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
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress forUser(\App\Models\User $user)
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress query()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerAddress whereAddress($value)
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
 * App\Models\Invoice
 *
 * @property int $id
 * @property string $invoice_number
 * @property string $path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\InvoiceFactory factory(...$parameters)
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
 * App\Models\Order
 *
 * @property int $id
 * @property string|null $order_number
 * @property float|null $service_fee
 * @property float|null $shipping_fee
 * @property float|null $grand_total
 * @property string|null $grand_total_before_discount
 * @property string|null $discounted_amount
 * @property float $extra_charge_total This will hold the cumulative value of all the extra charges per order
 * @property float $refund_total This will hold the cumulative value of all the refunds per order
 * @property int $user_id
 * @property int $payment_plan_id
 * @property int|null $order_status_id
 * @property int $shipping_order_address_id
 * @property int $billing_order_address_id
 * @property int $payment_method_id
 * @property int $shipping_method_id
 * @property int|null $coupon_id
 * @property int|null $invoice_id
 * @property int|null $order_shipment_id
 * @property int|null $order_customer_shipment_id
 * @property string|null $auto_saved_at
 * @property \Illuminate\Support\Carbon|null $arrived_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $notes
 * @property int|null $reviewed_by_id
 * @property int|null $graded_by_id
 * @property \Illuminate\Support\Carbon|null $reviewed_at
 * @property \Illuminate\Support\Carbon|null $graded_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Activitylog\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\OrderAddress $billingAddress
 * @property-read \App\Models\Coupon|null $coupon
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\OrderPayment[] $extraCharges
 * @property-read int|null $extra_charges_count
 * @property-read \App\Models\OrderPayment|null $firstOrderPayment
 * @property-read int $grand_total_cents
 * @property-read \App\Models\User|null $gradedBy
 * @property-read \App\Models\Invoice|null $invoice
 * @property-read \App\Models\OrderPayment|null $lastOrderPayment
 * @property-read \App\Models\OrderCustomerShipment|null $orderCustomerShipment
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\OrderItem[] $orderItems
 * @property-read int|null $order_items_count
 * @property-read \App\Models\OrderLabel|null $orderLabel
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\OrderPayment[] $orderPayments
 * @property-read int|null $order_payments_count
 * @property-read \App\Models\OrderShipment|null $orderShipment
 * @property-read \App\Models\OrderStatus|null $orderStatus
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\OrderStatusHistory[] $orderStatusHistory
 * @property-read int|null $order_status_history_count
 * @property-read \App\Models\PaymentMethod $paymentMethod
 * @property-read \App\Models\PaymentPlan $paymentPlan
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\OrderPayment[] $refunds
 * @property-read int|null $refunds_count
 * @property-read \App\Models\User|null $reviewedBy
 * @property-read \App\Models\OrderAddress $shippingAddress
 * @property-read \App\Models\ShippingMethod $shippingMethod
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|Order customerId(string $customerId)
 * @method static \Illuminate\Database\Eloquent\Builder|Order customerName(string $customerName)
 * @method static \Database\Factories\OrderFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Order forUser(\App\Models\User $user)
 * @method static \Illuminate\Database\Eloquent\Builder|Order newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Order newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Order placed()
 * @method static \Illuminate\Database\Eloquent\Builder|Order query()
 * @method static \Illuminate\Database\Eloquent\Builder|Order status(string|int $status)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereArrivedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereAutoSavedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereBillingOrderAddressId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCouponId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereDiscountedAmount($value)
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
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereOrderShipmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereOrderStatusId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaymentMethodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order wherePaymentPlanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereRefundTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereReviewedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereReviewedById($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereServiceFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippingFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippingMethodId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereShippingOrderAddressId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Order whereUserId($value)
 */
	class Order extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\OrderAddress
 *
 * @property int $id
 * @property string $first_name
 * @property string $last_name
 * @property string $address
 * @property string $city
 * @property string $state
 * @property string $zip
 * @property string $phone
 * @property string|null $flat
 * @property int $country_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Country $country
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderAddress whereAddress($value)
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
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Activitylog\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\CardProduct $cardProduct
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\OrderItemCustomerShipment|null $orderItemCustomerShipment
 * @property-read \App\Models\OrderItemShipment|null $orderItemShipment
 * @property-read \App\Models\OrderItemStatus $orderItemStatus
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\OrderItemStatusHistory[] $orderItemStatusHistory
 * @property-read int|null $order_item_status_history_count
 * @property-read \App\Models\UserCard|null $userCard
 * @method static \Database\Factories\OrderItemFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderItem forOrder(\App\Models\Order $order)
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
 * @method static \Database\Factories\OrderItemCustomerShipmentFactory factory(...$parameters)
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
 * @method static \Database\Factories\OrderItemShipmentFactory factory(...$parameters)
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
 * @method static \Database\Factories\OrderItemStatusFactory factory(...$parameters)
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
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Activitylog\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\OrderItem $orderItem
 * @property-read \App\Models\OrderItemStatus $orderItemStatus
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\OrderItemStatusHistoryFactory factory(...$parameters)
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
 * @property int $payment_method_id
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
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Activitylog\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\OrderPaymentFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment forDate(string $date)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment forMonth(string $date)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderPayment forValidPaidOrders()
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
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Activitylog\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\Order|null $order
 * @property-read \App\Models\ShippingMethod $shippingMethod
 * @method static \Database\Factories\OrderShipmentFactory factory(...$parameters)
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
 * @method static \Database\Factories\OrderStateFactory factory(...$parameters)
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
 * @method static \Database\Factories\OrderStatusFactory factory(...$parameters)
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
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Activitylog\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\Order $order
 * @property-read \App\Models\OrderStatus $orderStatus
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\OrderStatusHistoryFactory factory(...$parameters)
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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod enabled()
 * @method static \Database\Factories\PaymentMethodFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod query()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod visible()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentMethod whereIsEnabled($value)
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
 * @property int $display_position
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Coupon[] $coupons
 * @property-read int|null $coupons_count
 * @method static \Database\Factories\PaymentPlanFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan query()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereDiscountPercentage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereDisplayPosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereMaxProtectionAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan wherePriceBeforeDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereTurnaround($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentPlan whereUpdatedAt($value)
 */
	class PaymentPlan extends \Eloquent {}
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
 * @property-read \App\Models\CardProduct $cardProduct
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
 * App\Models\ScheduledEmail
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $send_at
 * @property string $payload
 * @property bool $is_sent
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\ScheduledEmailFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail query()
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereIsSent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereSendAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ScheduledEmail whereUpdatedAt($value)
 */
	class ScheduledEmail extends \Eloquent {}
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
 * @method static \Database\Factories\ShippingMethodFactory factory(...$parameters)
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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\StateFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|State newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|State newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|State query()
 * @method static \Illuminate\Database\Eloquent\Builder|State whereCode($value)
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
 * @property int $id
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $username
 * @property string $password
 * @property string|null $phone
 * @property string|null $profile_image
 * @property string|null $remember_token
 * @property mixed|null $ags_access_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property string|null $stripe_id
 * @property string|null $pm_type
 * @property string|null $pm_last_four
 * @property string|null $customer_number
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Coupon[] $coupons
 * @property-read int|null $coupons_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\CustomerAddress[] $customerAddresses
 * @property-read int|null $customer_addresses_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\UserDevice[] $devices
 * @property-read int|null $devices_count
 * @property-read string $name
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Order[] $orders
 * @property-read int|null $orders_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Permission\Models\Permission[] $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Permission\Models\Role[] $roles
 * @property-read int|null $roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Cashier\Subscription[] $subscriptions
 * @property-read int|null $subscriptions_count
 * @property-read \App\Models\Wallet|null $wallet
 * @method static \Illuminate\Database\Eloquent\Builder|User admin()
 * @method static \Illuminate\Database\Eloquent\Builder|User customer()
 * @method static \Database\Factories\UserFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User permission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User role($roles, $guard = null)
 * @method static \Illuminate\Database\Eloquent\Builder|User signedUpBetween(string $startDate, string $endDate)
 * @method static \Illuminate\Database\Eloquent\Builder|User submissions(string $minSubmissionCount, string $maxSubmissionCount)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereAgsAccessToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCustomerNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePmLastFour($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePmType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereProfileImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereStripeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUsername($value)
 */
	class User extends \Eloquent {}
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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property float|null $grade_delta
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Activitylog\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\OrderItem $orderItem
 * @property-read \App\Models\User $user
 * @property-read \App\Models\UserCardCertificate|null $userCardCertificate
 * @method static \Database\Factories\UserCardFactory factory(...$parameters)
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
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereOrderItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereOverallGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereOverallGradeNickname($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereOverallValues($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserCard whereRoboGradeValues($value)
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
 * @method static \Database\Factories\UserCardCertificateFactory factory(...$parameters)
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
 * @method static \Database\Factories\UserDeviceFactory factory(...$parameters)
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
 * App\Models\Wallet
 *
 * @property-read \App\Models\WalletTransaction|null $lastTransaction
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\WalletPayment[] $walletPayments
 * @property-read int|null $wallet_payments_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\WalletTransaction[] $walletTransactions
 * @property-read int|null $wallet_transactions_count
 * @method static \Database\Factories\WalletFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Wallet query()
 */
	class Wallet extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\WalletPayment
 *
 * @property-read \App\Models\PaymentMethod $paymentMethod
 * @property-read \App\Models\Wallet $wallet
 * @method static \Database\Factories\WalletPaymentFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WalletPayment query()
 */
	class WalletPayment extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\WalletTransaction
 *
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Wallet $wallet
 * @method static \Database\Factories\WalletTransactionFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WalletTransaction query()
 */
	class WalletTransaction extends \Eloquent {}
}

