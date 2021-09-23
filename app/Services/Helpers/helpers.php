<?php

use Illuminate\Database\Eloquent\Model;

/**
 * Helper used to get the id for values that can be the model instance
 * or just the id itself.
 * @param Model|int $model
 * @return int
 */
function getModelId(Model|int $model): int
{
    if ($model instanceof Model) {
        /** @noinspection PhpPossiblePolymorphicInvocationInspection */
        return $model->id;
    }

    return $model;
}
