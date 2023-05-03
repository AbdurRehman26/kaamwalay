<?php

namespace App\Concerns;

use Spatie\Tags\HasTags as SpatieHasTags;

trait HasTags
{
    use SpatieHasTags;

    public function attachTagsToModels(array $modelIds, array $tags): void
    {
        foreach ($this->whereIn('id', $modelIds)->get() as $model) {
            $model->attachTags($tags);
        }
    }

    public function detachTagsFromModels(array $modelIds, array $tags): void
    {
        foreach ($this->whereIn('id', $modelIds)->get() as $model) {
            $model->detachTags($tags);
        }
    }

    public function tagExists(string $tag): bool
    {
        return $this->tagsTranslated($tag)->exists();
    }
}
