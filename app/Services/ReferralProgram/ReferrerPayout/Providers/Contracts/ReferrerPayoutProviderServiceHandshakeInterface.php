<?php

namespace App\Services\ReferralProgram\ReferrerPayout\Providers\Contracts;

use App\Models\ReferrerPayout;

interface ReferrerPayoutProviderServiceHandshakeInterface
{
    public function handshake(ReferrerPayout $payout, array $data = []): array;
}
