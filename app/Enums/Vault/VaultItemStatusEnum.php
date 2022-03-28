<?php

namespace App\Enums\Vault;

enum VaultItemStatusEnum: int
{
    case IN_VAULT = 0;
    case SHIPPED = 1;
}
