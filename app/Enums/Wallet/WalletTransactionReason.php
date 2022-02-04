<?php

namespace App\Enums\Wallet;

enum WalletTransactionReason: string
{
    case REFUND = 'refund';
    case ORDER_PAYMENT = 'order_payment';
    case WALLET_CREDIT = 'wallet_credit_by_admin';
    case WALLET_PAYMENT = 'wallet_credit_by_user';
}
