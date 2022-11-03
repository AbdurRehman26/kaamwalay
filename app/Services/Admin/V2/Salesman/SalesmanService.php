<?php

namespace App\Services\Admin\V2\Salesman;

use App\Models\Salesman;
use App\Models\User;
use App\Services\EmailService;
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
            $this->storeSalesmanProfile($user, $data);

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
        $user->profile_image = $data['profile_image'];
        $user->save();
    }

    public function sendAccessEmailToCreatedUser(User $user): void
    {
        $token = Password::broker()->createToken($user);

        $this->emailService->sendEmail(
            [[$user->email => $user->first_name ?? '']],
            EmailService::SUBJECT[EmailService::TEMPLATE_CREATED_USER_ACCESS_ACCOUNT],
            EmailService::TEMPLATE_CREATED_USER_ACCESS_ACCOUNT,
            ['ACCESS_URL' => config('app.url') . '/auth/password/create?token='.$token.'&name='.$user->first_name.'&email='.urlencode($user->email)],
        );
    }
}
