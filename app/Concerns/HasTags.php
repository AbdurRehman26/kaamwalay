<?php

namespace App\Concerns;

use Spatie\Tags\HasTags as SpatieHasTags;
trait HasTags
{
    use SpatieHasTags;
    public function attachTagsToModels($modelIds, $tags): void
    {
        foreach ($this->whereIn('id', $modelIds)->get() as $model){
            $model->attachTags($tags);
        }
    }

    public function detachTagsFromModels($modelIds, $tags): void
    {
        foreach ($this->whereIn('id', $modelIds)->get() as $model){
            $model->detachTags($tags);
        }
    }

    /**
     * @return bool
     */
    public function tagExists($tag): bool
    {
        return $this->tagsTranslated($tag)->exists();
    }
}
