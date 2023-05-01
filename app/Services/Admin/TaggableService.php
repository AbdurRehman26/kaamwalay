<?php

namespace App\Services\Admin;

use App\Contracts\Taggable;

class TaggableService
{
    public function attachTags(Taggable $model, array $modelIds, array $tags): void
    {
        $model->attachTagsToModels($modelIds, $tags);
    }

    public function detachTags(Taggable $model, array $modelIds, array $tags): void
    {
        $model->detachTagsFromModels($modelIds, $tags);
    }
}
