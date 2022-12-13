<?php

namespace App\Services\Salesman\V2;

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
        return PaymentMethod::where('code', 'manual')->get();
    }
}
