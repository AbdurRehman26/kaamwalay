<?php

namespace App\Services\ReferralProgram\ReferrerPayout\Providers\Contracts;

interface ReferrerPayoutProviderServicePayInterface
{
    public function pay(array $items, array $data = []): array;
}
