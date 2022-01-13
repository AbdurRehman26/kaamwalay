<?php

namespace App\Models;

use App\Concerns\Coupons\CanHaveCoupons;
use App\Http\Filters\AdminCustomerSearchFilter;
use App\Http\Sorts\AdminCustomerFullNameSort;
use App\Services\EmailService;
use App\Services\SerialNumberService\SerialNumberService;
use Carbon\Carbon;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasRoles, HasFactory, Notifiable, Billable, CanResetPassword, CanHaveCoupons;

    public string $pushNotificationType = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['first_name', 'last_name', 'email', 'username', 'phone', 'password', 'customer_number', 'profile_image', 'ags_access_token'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token', 'roles.pivot'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'email_verified_at' => 'datetime',
        'ags_access_token' => 'encrypted',
    ];

    /**
     * The relations that should be returned with model.
     *
     * @var array
     */
    protected $with = ['roles:id,name'];

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    public static function createCustomer(array $data): self
    {
        /* @var User $user */
        $user = self::create($data);

        $user->assignCustomerRole();
        $user->assignCustomerNumber();

        return $user;
    }

    public static function createAdmin(array $data): self
    {
        $user = self::create($data);

        $user->assignRole(Role::findByName(config('permission.roles.admin')));

        return $user;
    }

    public static function getAllowedAdminFilters(): array
    {
        return [
            AllowedFilter::custom('search', new AdminCustomerSearchFilter),
            AllowedFilter::scope('signed_up_between'),
            AllowedFilter::scope('submissions'),
        ];
    }

    public static function getAllowedAdminSorts(): array
    {
        return [
            AllowedSort::field('submissions', 'orders_count'),
            AllowedSort::custom('full_name', new AdminCustomerFullNameSort),
            'email',
            'customer_number',
            'created_at',
        ];
    }

    public function customerAddresses(): HasMany
    {
        return $this->hasMany(CustomerAddress::class, 'user_id');
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
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function getFullName(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(config('permission.roles.admin'));
    }

    public function isCustomer(): bool
    {
        return $this->hasRole(config('permission.roles.customer'));
    }

    public function getNameAttribute(): string
    {
        return $this->getFullName();
    }

    public function assignCustomerRole(): void
    {
        $this->assignRole(Role::findByName(config('permission.roles.customer')));
    }

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

    public function assignCustomerNumber(): self
    {
        if (! $this->customer_number) {
            $this->customer_number = SerialNumberService::customer($this->id)->toString();
            $this->save();
        }

        return $this;
    }

    public function scopeSignedUpBetween(Builder $query, string $startDate, string $endDate): Builder
    {
        return $query->whereBetween('created_at', [Carbon::parse($startDate), Carbon::parse($endDate)]);
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

    protected function getPasswordResetRoute(string $token): string
    {
        return route('password.reset', [
            'token' => $token,
            'email' => $this->getEmailForPasswordReset(),
        ]);
    }
}
