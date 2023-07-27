<?php

namespace App\Contracts;

interface Taggable
{
    public function attachTagsToModels(array $modelIds, array $tags): void;

    public function detachTagsFromModels(array $modelIds, array $tags): void;
}
