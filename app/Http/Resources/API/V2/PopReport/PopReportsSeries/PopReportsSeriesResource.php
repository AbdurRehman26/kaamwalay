<?php

namespace App\Http\Resources\API\V2\PopReport\PopReportsSeries;

use App\Http\Resources\API\BaseResource;
use App\Models\PopReportsSeries;
use Illuminate\Http\Request;

/**
 * @mixin PopReportsSeries
 */
class PopReportsSeriesResource extends BaseResource
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
            'card_series_id' => $this->card_series_id,
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
            'name' => $this->card_series_id ? $this->cardSeries->name : null,
            'image_path' => $this->card_series_id ? $this->cardSeries->image_path : null,
            'release_date' => $this->card_series_id ? $this->cardSeries->release_date : null,
        ];
    }
}
