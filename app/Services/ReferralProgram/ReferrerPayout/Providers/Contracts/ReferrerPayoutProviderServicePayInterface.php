<?php

namespace App\Services\ReferralProgram\ReferrerPayout\Providers\Contracts;

use App\Models\Order;
use App\Models\OrderPayment;
use Illuminate\Support\Collection;

interface ReferrerPayoutProviderServicePayInterface
{
    public function pay(array $items, array $data = []): array;
}
