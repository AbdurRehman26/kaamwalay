<?php

namespace App\Models;

use App\Concerns\Coupons\CanHaveCoupons;
use App\Contracts\Exportable;
use App\Contracts\ExportableWithSort;
use App\Enums\Order\OrderPaymentStatusEnum;
use App\Http\Filters\AdminCustomerPromotionalSubscribersFilter;
use App\Http\Filters\AdminCustomerSearchFilter;
use App\Http\Filters\AdminSalesmanSearchFilter;
use App\Http\Filters\AdminUserReferredBy;
use App\Http\Sorts\AdminCustomerCardsSort;
use App\Http\Sorts\AdminCustomerFullNameSort;
use App\Http\Sorts\AdminCustomerSubmissionsSort;
use App\Http\Sorts\AdminCustomerWalletSort;
use App\Http\Sorts\AdminSalesmanSalesSort;
use App\Services\EmailService;
use App\Services\SerialNumberService\SerialNumberService;
use App\Services\Wallet\WalletService;
use App\Traits\ReferrableTrait;
use Carbon\Carbon;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Filament\Panel;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Cashier\Billable;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use TaylorNetwork\UsernameGenerator\FindSimilarUsernames;
use TaylorNetwork\UsernameGenerator\Generator;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * @property-read int $paid_orders_count
 * @property-read int $order_items_sum_quantity
 */
class User extends Authenticatable implements Exportable, ExportableWithSort, FilamentUser, HasAvatar, JWTSubject
{
    use Billable, CanHaveCoupons, CanResetPassword, FindSimilarUsernames, HasFactory, HasRoles, Notifiable, ReferrableTrait, SoftDeletes;

    public string $pushNotificationType = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['first_name', 'last_name', 'email', 'username', 'phone', 'password', 'customer_number', 'profile_image', 'ags_access_token', 'is_active', 'salesman_id', 'last_login_at', 'created_by', 'is_marketing_notifications_enabled', 'referred_by'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password', 'remember_token', 'roles.pivot'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'email_verified_at' => 'datetime',
        'ags_access_token' => 'encrypted',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
        'is_marketing_notifications_enabled' => 'boolean',
        'referred_by' => 'integer',
    ];

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    public static function createCustomer(array $data): self
    {
        $data['username'] = self::generateUserName();
        if (! isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        /* @var User $user */
        $user = self::create($data);

        $user->assignCustomerRole();
        $user->assignCustomerNumber();
        $user->assignReferrer($data);

        (new WalletService)->createWallet(['user_id' => $user->id, 'balance' => 0]);

        return $user;
    }

    public static function createAdmin(array $data): self
    {
        if (! isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        $user = self::create($data);

        $user->assignRole(Role::findByName(config('permission.roles.admin')));

        return $user;
    }

    public static function createSalesman(array $data): self
    {
        $data['password'] = Str::random(8);
        $data['created_by'] = auth()->user()->id;
        $data['username'] = self::generateUserName();

        /* @var User $user */
        $user = self::create($data);

        $user->assignSalesmanRole();

        return $user;
    }

    public static function getAllowedFilters(): array
    {
        return [
            AllowedFilter::custom('search', new AdminCustomerSearchFilter),
            AllowedFilter::scope('signed_up_between'),
            AllowedFilter::scope('submissions'),
            AllowedFilter::scope('salesman_id'),
            AllowedFilter::custom('promotional_subscribers', new AdminCustomerPromotionalSubscribersFilter),
            AllowedFilter::custom('referred_by', new AdminUserReferredBy),
        ];
    }

    public static function getAllowedSorts(): array
    {
        return [
            AllowedSort::custom('submissions', new AdminCustomerSubmissionsSort),
            AllowedSort::custom('full_name', new AdminCustomerFullNameSort),
            AllowedSort::custom('wallet', new AdminCustomerWalletSort),
            AllowedSort::custom('cards', new AdminCustomerCardsSort),
            'email',
            'customer_number',
            'created_at',
        ];
    }

    public static function getAllowedAdminFilters(): array
    {
        return self::getAllowedFilters();
    }

    public static function getAllowedAdminSorts(): array
    {
        return self::getAllowedSorts();
    }

    public static function getAllowedSalesmanFilters(): array
    {
        return self::getAllowedFilters();
    }

    public static function getAllowedSalesmanSorts(): array
    {
        return self::getAllowedSorts();
    }

    public static function getAllowedAdminSalesmanFilters(): array
    {
        return [
            AllowedFilter::custom('search', new AdminSalesmanSearchFilter),
            AllowedFilter::scope('signed_up_between', 'salesmanSignedUpBetween'),
            AllowedFilter::scope('is_active', 'isActiveSalesman'),
        ];
    }

    /**
     * @param  Builder <User>  $query
     * @return Builder <User>
     */
    public function scopeIsActiveSalesman(Builder $query, bool $value): Builder
    {
        return $query->whereHas('salesmanProfile', function ($subQuery) use ($value) {
            $subQuery->where('is_active', $value);
        });
    }

    public static function getAllowedAdminSalesmanSorts(): array
    {
        return [
            AllowedSort::custom('sales', new AdminSalesmanSalesSort),
        ];
    }

    public function customerAddresses(): HasMany
    {
        return $this->hasMany(CustomerAddress::class, 'user_id');
    }

    /**
     * @return BelongsTo<User, User>
     */
    public function salesman(): BelongsTo
    {
        return $this->belongsTo(User::class, 'salesman_id');
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims(): array
    {
        return [];
    }

    public function getFullName(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole(config('permission.roles.super-admin'));
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(config('permission.roles.admin'));
    }

    public function isCustomer(): bool
    {
        return $this->hasRole(config('permission.roles.customer'));
    }

    public function isSalesman(): bool
    {
        return $this->hasRole(config('permission.roles.salesman'));
    }

    public function getNameAttribute(): string
    {
        return $this->getFullName();
    }

    public function assignSalesmanRole(): void
    {
        $this->assignRole(Role::findByName(config('permission.roles.salesman')));
    }

    public function removeSalesmanRole(): void
    {
        $this->removeRole(Role::findByName(config('permission.roles.salesman')));
    }

    public function assignCustomerRole(): void
    {
        $this->assignRole(Role::findByName(config('permission.roles.customer')));
    }

    public function assignSalesman(User $salesman): bool
    {
        $this->salesman_id = $salesman->id;

        return $this->save();
    }

    public function unAssignSalesman(): bool
    {
        $this->salesman_id = null;

        return $this->save();
    }

    /**
     * @return HasMany<Order>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function devices(): HasMany
    {
        return $this->hasMany(UserDevice::class);
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * @return BelongsTo<User, User>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasManyThrough<OrderItem>
     */
    public function orderItems(): HasManyThrough
    {
        return $this->hasManyThrough(OrderItem::class, Order::class);
    }

    public function cardsCount(): int
    {
        return $this->orders()->paid()
            ->join('order_items', 'order_id', '=', 'orders.id')
            ->sum('order_items.quantity');
    }

    public function assignCustomerNumber(): self
    {
        if (! $this->customer_number) {
            $this->customer_number = SerialNumberService::customer($this->id)->toString();
            $this->save();
        }

        return $this;
    }

    public function assignReferrer(array $data): void
    {
        if (array_key_exists('referral_code', $data) && $data['referral_code']) {
            $this->referred_by = Referrer::where('referral_code', $data['referral_code'])->first()->user_id;
            $this->save();
        }
    }

    public static function generateUserName(): string
    {
        return (new Generator())->generate();
    }

    /**
     * @param  Builder <User>  $query
     * @return Builder <User>
     */
    public function scopeSalesmanSignedUpBetween(Builder $query, string $startDate, string $endDate): Builder
    {
        return $query->whereHas('salesmanProfile', function ($subQuery) use ($startDate, $endDate) {
            $subQuery->whereBetween('created_at', [Carbon::parse($startDate)->startOfDay(), Carbon::parse($endDate)->endOfDay()]);
        });
    }

    public function scopeSignedUpBetween(Builder $query, string $startDate, string $endDate): Builder
    {
        return $query->whereBetween('created_at', [Carbon::parse($startDate)->startOfDay(), Carbon::parse($endDate)->endOfDay()]);
    }

    public function scopeSubmissions(Builder $query, string $minSubmissionCount, string $maxSubmissionCount): Builder
    {
        return $query->whereHas('orders', function ($subQuery) {
            $subQuery->placed();
        }, '>=', (int) $minSubmissionCount)->whereHas('orders', function ($subQuery) {
            $subQuery->placed();
        }, '<=', (int) $maxSubmissionCount);
    }

    public function scopeAdmin(Builder $query): Builder
    {
        // @phpstan-ignore-next-line
        return $query->role(Role::findByName(config('permission.roles.admin')));
    }

    public function scopeCustomer(Builder $query): Builder
    {
        // @phpstan-ignore-next-line
        return $query->role(Role::findByName(config('permission.roles.customer')));
    }

    /**
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeSalesmanId(Builder $query, int|string $salesmanId): Builder
    {
        return $query->whereHas('salesman', fn ($query) => $query->where('id', $salesmanId));
    }

    /**
     * @return HasOne<Salesman>
     */
    public function salesmanProfile(): HasOne
    {
        return $this->hasOne(Salesman::class, 'user_id', 'id');
    }

    /**
     * @param  Builder <User>  $query
     * @return Builder <User>
     */
    public function scopeSalesmen(Builder $query): Builder
    {
        return $query->role(Role::findByName(config('permission.roles.salesman'), 'api'));
    }

    /**
     * @return HasMany<Order>
     */
    public function salesmanOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'salesman_id', 'id');
    }

    public function salesmanCustomersCount(): int
    {
        return $this->hasMany(User::class, 'salesman_id', 'id')->count();
    }

    public function sendPasswordResetNotification($token)
    {
        /* @var EmailService $emailService */
        $emailService = resolve(EmailService::class);
        $emailService->sendEmail(
            [[$this->getEmailForPasswordReset() => $this->name]],
            $emailService::SUBJECT[$emailService::TEMPLATE_SLUG_FORGOT_PASSWORD],
            $emailService::TEMPLATE_SLUG_FORGOT_PASSWORD,
            [
                'PASSWORD_RESET_LINK' => $this->getPasswordResetRoute($token),
            ],
        );
    }

    public function routeNotificationForPusherPushNotifications(): string
    {
        return $this->email;
    }

    public function routeNotificationForTwilio(): string
    {
        return $this->phone;
    }

    protected function getPasswordResetRoute(string $token): string
    {
        return route('password.reset', [
            'token' => $token,
            'email' => $this->getEmailForPasswordReset(),
        ]);
    }

    /**
     * @return Builder <User>
     */
    public function exportQuery(): Builder
    {
        return self::query()
            ->customer()
            ->withCount(['orders as paid_orders_count' => fn ($query) => ($query->paid())])
            ->withSum([
                'orderItems' => fn (Builder $query) => (
                    $query->where('orders.payment_status', OrderPaymentStatusEnum::PAID)
                ),
            ], 'quantity')
            ->with(['wallet:id,user_id,balance', 'salesman:id,first_name,last_name']);
    }

    public function exportHeadings(): array
    {
        return ['Name', 'ID', 'Email', 'Phone', 'Signed Up', 'Submissions', 'Cards', 'Owner', 'Wallet Balance'];
    }

    public function exportFilters(): array
    {
        return self::getAllowedAdminFilters();
    }

    public function exportIncludes(): array
    {
        return [];
    }

    public function exportRowMap(Model $row): array
    {
        return [
            $row->name,
            $row->customer_number,
            $row->email,
            $row->phone,
            $row->created_at,
            $row->paid_orders_count,
            $row->order_items_sum_quantity,
            $row->salesman?->name, // @phpstan-ignore-line
            $row->wallet?->balance,
        ];
    }

    public function exportSort(): array
    {
        return self::getAllowedAdminSorts();
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isSuperAdmin();
    }

    public function getFilamentAvatarUrl(): ?string
    {
        return $this->profile_image;
    }

    /**
     * @return HasMany<SalesmanCommissionPayment>
     */
    public function salesmanCommissionPayments(): HasMany
    {
        return $this->hasMany(SalesmanCommissionPayment::class, 'salesman_id');
    }

    public function receivedCommissionTotal(): float
    {
        return $this->salesmanCommissionPayments()->sum('amount');
    }

    public function wantsToReceiveMarketingContent(): bool
    {
        return $this->is_marketing_notifications_enabled;
    }

    public function getSalesmanCardsCount(string $startDate = '', string $endDate = ''): int
    {
        $query = $this->salesmanOrders()->paid()->join('order_items', 'order_items.order_id', 'orders.id');

        if ($startDate && $endDate) {
            $query->whereBetween('orders.created_at', [$startDate, $endDate]);
        }

        return $query->sum('order_items.quantity');
    }
}
