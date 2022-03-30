<?php

namespace App\Enums\Vault;

enum VaultShipmentItemStatusEnum: int
{
    case IN_VAULT = 0;
    case SHIPPED = 1;
}
