<?php

namespace App\Http\Controllers\API\V2\Customer\Address;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Customer\ListStatesRequest;
use App\Http\Resources\API\V2\Customer\Address\State\StateCollection;
use App\Http\Resources\API\V2\Customer\Address\State\StateResource;
use App\Models\State;
use Illuminate\Support\Facades\Cache;

class StateController extends Controller
{
    public const DEFAULT_COUNTRY_ID = 1;

    public function index(ListStatesRequest $request): StateCollection
    {
        $countryId = $request->country_id ?? self::DEFAULT_COUNTRY_ID;

        $states = Cache::remember('states-'.$countryId, now()->addWeek(), fn () => State::where('country_id', $countryId)->with('country')->get());

        return new StateCollection($states);
    }

    public function show(int $id): StateResource
    {
        return new StateResource(State::findOrFail($id));
    }
}
