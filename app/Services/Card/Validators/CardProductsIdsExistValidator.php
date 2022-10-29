<?php

namespace App\Services\Card\Validators;

use App\Exceptions\Services\SomeCardsDontExistException;
use App\Models\CardProduct;

use function throw_if;

class CardProductsIdsExistValidator
{
    public static function validate(array $ids): void
    {
        throw_if(
            CardProduct::whereIn('id', $ids)->count() < count($ids),
            new SomeCardsDontExistException()
        );
    }
}
