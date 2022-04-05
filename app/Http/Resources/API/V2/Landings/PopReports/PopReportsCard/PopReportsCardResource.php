<?php

namespace App\Http\Resources\API\V2\Landings\PopReports\PopReportsCard;

use App\Http\Resources\API\BaseResource;
use App\Models\PopReportsCard;
use Illuminate\Http\Request;

/**
 * @mixin PopReportsCard
 */
class PopReportsCardResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'card_set_id' => $this->card_set_id,
            'card_product_id' => $this->card_product_id,
            'pr' => $this->pr,
            'fr' => $this->fr,
            'good' => $this->good,
            'good_plus' => $this->good_plus,
            'vg' => $this->vg,
            'vg_plus' => $this->vg_plus,
            'vg_ex' => $this->vg_ex,
            'vg_ex_plus' => $this->vg_ex_plus,
            'ex' => $this->ex,
            'ex_plus' => $this->ex_plus,
            'ex_mt' => $this->ex_mt,
            'ex_mt_plus' => $this->ex_mt_plus,
            'nm' => $this->nm,
            'nm_plus' => $this->nm_plus,
            'nm_mt' => $this->nm_mt,
            'nm_mt_plus' => $this->nm_mt_plus,
            'mint' => $this->mint,
            'mint_plus' => $this->mint_plus,
            'gem_mt' => $this->gem_mt,
            'total' => $this->total,
            'total_plus' => $this->total_plus,
            'name' => $this->card_product_id ? $this->cardProduct->name : null,
            'image_path' => $this->card_product_id ? $this->cardProduct->image_path : null,
            'short_name' => $this->card_product_id ? $this->cardProduct->getShortName() : null,
            'searchable_name' => $this->card_product_id ? $this->cardProduct->getSearchableName() : null,
            'card_number_order' => $this->card_product_id ? $this->cardProduct->card_number_order : null,
        ];
    }
}
