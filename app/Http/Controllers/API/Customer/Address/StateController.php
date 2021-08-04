<?php

namespace App\Http\Controllers\API\Customer\Address;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\Address\State\StateCollection;
use App\Http\Resources\API\Customer\Address\State\StateResource;
use App\Models\State;
use Illuminate\Http\Request;

class StateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new StateCollection(State::all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return new StateResource(State::findOrFail($id));
    }
}
