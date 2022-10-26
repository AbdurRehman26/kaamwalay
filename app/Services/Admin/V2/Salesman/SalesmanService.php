<?php

namespace App\Services\Admin\V2\Salesman;

use App\Models\Order;
use App\Models\Salesman;
use App\Models\User;
use App\Services\EmailService;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Support\Facades\Password;
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
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::PER_PAGE));
    }

    /**
     * @throws Throwable
     */
    public function createSalesman(array $data): User
    {
        try{

            DB::beginTransaction();

            $salesman = User::createSalesman($data);
            $this->storeCommissionStructure($salesman, $data);
            $this->sendAccessEmailToCreatedUser($salesman);

            DB::commit();

            return $salesman;
        } catch (Exception $e) {

            DB::rollBack();
            Log::error($e->getMessage());

            throw $e;
        }
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

    protected function storeCommissionStructure(User $user, $data): Salesman
    {
        return Salesman::updateOrCreate(
            [
                'user_id' => $user->id
            ],
            [
                'commission_type_id' => $data['commission_type_id'],
                'commission_type_value' => $data['commission_type_value']
            ]
        );
    }

    public function getSales(array $data): int
    {
        return Order::forSalesman(User::find($data['salesman_id']))
            ->betweenDates($data['from_date'], $data['to_date'])
            ->sum('grand_total');
    }

    public function getCommissionsEarned(array $data): int
    {
        return Order::forSalesman(User::find($data['salesman_id']))
            ->betweenDates($data['from_date'], $data['to_date'])
            ->sum('commission_earned');
    }
}