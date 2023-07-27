<?php

namespace App\Services\Admin\V2\Salesman;

use App\Models\Salesman;
use App\Models\User;
use App\Services\EmailService;
use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class SalesmanService
{
    protected const PER_PAGE = 20;

    public function __construct(protected EmailService $emailService)
    {
        //
    }

    // @phpstan-ignore-next-line
    public function getSalesmen(): LengthAwarePaginator
    {
        return QueryBuilder::for(User::salesmen())
            ->allowedFilters(User::getAllowedAdminSalesmanFilters())
            ->allowedSorts(User::getAllowedAdminSalesmanSorts())
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::PER_PAGE));
    }

    /**
     * @throws Throwable
     */
    public function createSalesman(array $data): User
    {
        try {
            DB::beginTransaction();

            $salesman = User::createSalesman($data);
            $this->storeSalesmanProfile($salesman, $data);
            $this->sendAccessEmailToCreatedUser($salesman);

            DB::commit();

            return $salesman;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
    }

    /**
     * @throws Throwable
     */
    public function assignSalesmanRoleToUser(User $user, array $data): User
    {
        try {
            DB::beginTransaction();

            $this->updateUserInfo($user, $data);
            $user->assignSalesmanRole();
            $this->storeSalesmanProfile($user, $data);

            DB::commit();

            return $user->refresh();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
    }

    /**
     * @throws Throwable
     */
    public function removeSalesmanRoleFromUser(User $user): User
    {
        try {
            DB::beginTransaction();

            $user->removeSalesmanRole();

            DB::commit();

            return $user->refresh();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
    }

    /**
     * @throws Throwable
     */
    public function updateSalesman(User $salesman, array $data): User
    {
        try {
            DB::beginTransaction();

            $this->updateUserInfo($salesman, $data);
            $this->storeSalesmanProfile($salesman, $data);

            DB::commit();

            return $salesman;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
    }

    /**
     * @throws Throwable
     */
    public function setActive(User $user, array $data): User
    {
        try {
            DB::beginTransaction();

            Salesman::updateOrCreate(
                [
                    'user_id' => $user->id,
                ],
                [
                    'is_active' => $data['is_active'],
                ]
            );

            DB::commit();

            return $user->refresh();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
    }

    protected function storeSalesmanProfile(User $user, array $data): Salesman
    {
        return Salesman::updateOrCreate(
            [
                'user_id' => $user->id,
            ],
            [
                'is_active' => $data['is_active'],
                'commission_type' => $data['commission_type'],
                'commission_value' => $data['commission_value'],
            ]
        );
    }

    private function updateUserInfo(User $user, array $data): void
    {
        $user->first_name = $data['first_name'];
        $user->last_name = $data['last_name'];
        $user->phone = $data['phone'];
        $user->profile_image = $data['profile_image'] ?? '';
        $user->save();
    }

    public function sendAccessEmailToCreatedUser(User $user): void
    {
        $token = Password::broker()->createToken($user);

        $this->emailService->sendEmail(
            [[$user->email => $user->first_name ?? '']],
            EmailService::SUBJECT[EmailService::TEMPLATE_CREATED_USER_ACCESS_ACCOUNT],
            EmailService::TEMPLATE_CREATED_USER_ACCESS_ACCOUNT,
            ['ACCESS_URL' => config('app.url').'/auth/password/create?token='.$token.'&name='.$user->first_name.'&email='.urlencode($user->email)],
        );
    }

    public function getStat(User $user, array $data): float
    {
        $now = Carbon::now();

        switch ($data['time_filter']) {
            case 'this_month':
                $startDate = $now->copy()->startOfMonth()->toDateString();
                $endDate = $now->copy()->endOfMonth()->toDateString();

                break;
            case 'last_month':
                $startDate = $now->copy()->subMonth()->startOfMonth()->toDateString();
                $endDate = $now->copy()->subMonth()->endOfMonth()->toDateString();

                break;
            case 'this_year':
                $startDate = $now->copy()->startOfYear()->toDateString();
                $endDate = $now->copy()->endOfYear()->toDateString();

                break;
            case 'last_year':
                $startDate = $now->copy()->subYear()->startOfYear()->toDateString();
                $endDate = $now->copy()->subYear()->endOfYear()->toDateString();

                break;
            case 'custom':
                $startDate = $data['start_date'];
                $endDate = $data['end_date'];

                break;
            default:
                return 0;
        }

        $startDate .= ' 00:00:00';
        $endDate .= ' 23:59:59';

        switch ($data['stat_name']) {
            case 'sales':
                return $user->salesmanOrders()->paid()->whereBetween('created_at', [$startDate, $endDate])->sum('grand_total');
            case 'commission_earned':
                return $user->salesmanProfile->salesmanEarnedCommissions()->whereBetween('created_at', [$startDate, $endDate])->sum('commission');
            case 'commission_paid':
                return $user->salesmanCommissionPayments()->whereBetween('created_at', [$startDate, $endDate])->sum('amount');
            case 'orders':
                return $user->salesmanOrders()->paid()->whereBetween('created_at', [$startDate, $endDate])->count();
            case 'cards':
                return $user->getSalesmanCardsCount($startDate, $endDate);
            default:
                return 0;
        }
    }
}
