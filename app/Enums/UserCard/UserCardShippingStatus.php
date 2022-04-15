<?php

namespace App\Enums\UserCard;

enum UserCardShippingStatus: int
{
    case PENDING = 0;
    case SHIPPED = 1;
    case IN_VAULT = 2;
}