<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Models\AutographProduct;
use App\Services\AutographProductService;

class AutographController extends Controller
{
    public function __construct(protected AutographProductService $autographProductService)
    {
    }

    public function index()
    {
        // return view('landings.authentication.index');
    }

    public function getView(AutographProduct $autographProduct)
    {
        $data = $this->autographProductService->getDataForPublicPage($autographProduct);

        // return view('landings.authentication.view', $data);
    }
}
