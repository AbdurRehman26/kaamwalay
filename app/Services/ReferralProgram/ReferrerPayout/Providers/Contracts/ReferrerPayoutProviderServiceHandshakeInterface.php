<?php

namespace App\Services\ReferralProgram\ReferrerPayout\Providers\Contracts;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\ReferrerPayout;
use Illuminate\Support\Collection;

interface ReferrerPayoutProviderServiceHandshakeInterface
{
    public function handshake(ReferrerPayout $payout, array $data = []): array;
}
