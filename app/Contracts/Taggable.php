<?php

namespace App\Contracts;

interface Taggable
{
    public function attachTagsToModels(array $modelIds, array $tags);
    public function detachTagsFromModels(array $modelIds, array $tags);
}
