<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Contracts\Taggable;
use App\Exceptions\Services\Admin\ModelNotTaggableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\Taggable\TaggableModelRequest;
use App\Services\Admin\TaggableService;
use Illuminate\Http\JsonResponse;

class TaggableController extends Controller
{
    public function __construct(protected TaggableService $taggableService)
    {
    }

    /**
     * @throws ModelNotTaggableException
     */
    public function attachTags(TaggableModelRequest $request): JsonResponse
    {
        $this->taggableService->attachTags(
            $this->getModelInstance($request->validated('model')),
            $request->validated('model_ids'),
            $request->validated('tags')
        );

        return new JsonResponse(['success' => true]);
    }

    /**
     * @throws ModelNotTaggableException
     */
    public function detachTags(TaggableModelRequest $request): JsonResponse
    {
        $this->taggableService->detachTags(
            $this->getModelInstance($request->validated('model')),
            $request->validated('model_ids'),
            $request->validated('tags')
        );

        return new JsonResponse(['success' => true]);
    }

    /**
     * @throws ModelNotTaggableException
     */
    protected function getModelInstance(string $model): Taggable
    {
        $class = '\\App\\Models\\'.ucfirst($model);
        $instance = new $class;

        if (! $instance instanceof Taggable) {
            throw new ModelNotTaggableException();
        }

        return $instance;
    }
}
