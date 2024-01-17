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

    // Add return type after returning view, and remove static analysis ignore
    // @phpstan-ignore-next-line
    public function index()
    {
        // return view('landings.authentication.index');
    }

    // Add return type after returning view, and remove static analysis ignore
    // @phpstan-ignore-next-line
    public function getView(AutographProduct $autographProduct)
    {
        $data = $this->autographProductService->getDataForPublicPage($autographProduct);

        // return view('landings.authentication.view', $data);
    }
}
