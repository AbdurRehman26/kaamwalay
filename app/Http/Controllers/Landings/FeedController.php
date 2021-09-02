<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use Illuminate\View\View;

class FeedController extends Controller
{
    public function getList():View
    {
        return view('landings.feed.list');
    }

    public function getView(): View
    {
        return view('landings.feed.view');
    }
}
