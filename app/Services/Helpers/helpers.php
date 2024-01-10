<?php

use Illuminate\Database\Eloquent\Model;

/**
 * Helper used to get the id for values that can be the model instance
 * or just the id itself.
 */
function getModelId(Model|int $model): int
{
    if ($model instanceof Model) {
        /** @noinspection PhpPossiblePolymorphicInvocationInspection */
        return $model->id;
    }

    return $model;
}

function maskEmail(string $email): string
{
    // Separate the local part and domain
    [$localPart, $domain] = explode('@', $email, 2);

    // Mask all characters in the local part except the first letter
    $maskedLocalPart = $localPart[0].str_repeat('*', max(0, strlen($localPart) - 1));

    // Separate the domain into subdomain and top-level domain
    [$subdomain, $tld] = explode('.', $domain, 2);

    // Mask all characters in the subdomain
    $maskedSubdomain = str_repeat('*', strlen($subdomain));

    // Combine the masked local part, masked subdomain, and top-level domain
    return $maskedLocalPart.'@'.$maskedSubdomain.'.'.$tld;
}
