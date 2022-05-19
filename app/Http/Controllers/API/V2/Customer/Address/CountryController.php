<?php

namespace App\Http\Controllers\API\V2\Customer\Address;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Country\CountryCollection;
use App\Models\Country;
use Illuminate\Support\Facades\Cache;

class CountryController extends Controller
{
    public function index(): CountryCollection
    {
        $countries = Cache::remember('countries', now()->addWeek(), fn () => Country::enabled()->get());

        return new CountryCollection($countries);
    }

}
