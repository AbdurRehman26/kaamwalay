<?php

namespace App\Http\Controllers\API\Customer\Address;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\Address\State\StateCollection;
use App\Http\Resources\API\Customer\Address\State\StateResource;
use App\Models\State;

class StateController extends Controller
{
    public function index(): StateCollection
    {
        return new StateCollection(State::all());
    }

    public function show(int $id): StateResource
    {
        return new StateResource(State::findOrFail($id));
    }
}
