<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\CardLabel\UpdateCardLabelRequest;
use App\Http\Resources\API\V2\Admin\CardLabel\CardLabelCollection;
use App\Http\Resources\API\V2\Admin\CardLabel\CardLabelResource;
use App\Models\CardLabel;
use App\Models\CardProduct;
use App\Services\Admin\Card\CardLabelService;
use Illuminate\Http\Request;

class CardLabelController extends Controller
{
    public function __construct(protected CardLabelService $cardLabelService)
    {
    }

    /**
     * @return CardLabelCollection
     */
    public function index(): CardLabelCollection
    {
        return new CardLabelCollection(
            $this->cardLabelService->search()
        );
    }

    public function getCardProductLabel(CardProduct $cardProduct): CardLabelResource
    {
        return new CardLabelResource($this->cardLabelService->getOrCreateCardProductLabel($cardProduct));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }


    public function update(UpdateCardLabelRequest $request, CardLabel $label): CardLabelResource
    {
        return new CardLabelResource($this->cardLabelService->updateCardLabel($label, $request->except('id')));
    }
}
