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

function formatNumbers(int $num): int|string
{
    if ($num>1000) {
        $x = round($num);
        $x_number_format = number_format($x);
        $x_array = explode(',', $x_number_format);
        $x_parts = array('k', 'm', 'b');
        $x_count_parts = count($x_array) - 1;
        $x_display = $x_array[0] . ((int) $x_array[1][0] !== 0 ? '.' . $x_array[1][0] : '');
        $x_display .= $x_parts[$x_count_parts - 1];
        return $x_display;
    }

    return $num;
}
