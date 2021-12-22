<?php

namespace App\Http\Controllers\API\V1\Customer\Address;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Customer\Address\State\StateCollection;
use App\Http\Resources\API\V1\Customer\Address\State\StateResource;
use App\Models\State;
use Illuminate\Support\Facades\Cache;

class StateController extends Controller
{
    public function index(): StateCollection
    {
        $states = Cache::remember('states', now()->addWeek(), fn () => State::all());

        return new StateCollection($states);
    }

    public function show(int $id): StateResource
    {
        return new StateResource(State::findOrFail($id));
    }
}
