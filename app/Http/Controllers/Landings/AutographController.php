<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Models\AutographProduct;
use App\Services\AutographProductService;
use Illuminate\View\View;

class AutographController extends Controller
{
    public function __construct(protected AutographProductService $autographProductService)
    {
    }

    public function index(): View
    {
        return view('landings.authentication.index');
    }

    public function getView(AutographProduct $autographProduct): View
    {
        $data = $this->autographProductService->getDataForPublicPage($autographProduct);

        return view('landings.authentication.view', $data);
    }
}
