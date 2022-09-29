<?php

namespace App\Services\Admin\V2;

use App\Models\PaymentMethod;
use Illuminate\Support\Collection;

class PaymentMethodService
{
    /**
     * @return Collection<int, PaymentMethod>
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     */
    public function getPaymentMethods(): Collection
    {
        if (request()->get('submission_create') === 'true') {
            return PaymentMethod::where('code', 'manual')->get();
        }

        return PaymentMethod::enabled()->visible()->get();
    }
}
