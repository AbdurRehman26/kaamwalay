<?php

namespace App\Services\Admin\Card;

use App\Models\CardCategory;
use App\Models\CardLabel;
use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Support\Str;

class CreateCardLabelService
{
    protected OrderItem $orderItem;
    protected CardProduct $cardProduct;
    protected CardCategory $category;
    protected CardSeries $cardSeries;
    protected CardSet $cardSet;
    protected string $cardSeriesName;
    protected string $cardSetName;
    protected int $year;

    public function createLabelForOrder(Order $order): void
    {
        foreach ($order->orderItems as $orderItem){
            if($orderItem->canCreateLabel()){
                $this->createLabel($orderItem->cardProduct);
            }
        }
    }

    protected function initializeValues(CardProduct $cardProduct): void
    {
        $this->cardProduct = $cardProduct;
        $this->year = $cardProduct->cardSet->release_year;
        $this->category = $cardProduct->cardCategory;
        $this->cardSet = $cardProduct->cardSet;
        $this->cardSeries = $this->cardSet->cardSeries;
        $this->cardSetName = Str::upper($cardProduct->cardSet->name);
        $this->cardSeriesName = Str::upper($this->cardSet->cardSeries->name);
    }

    public function createLabel(CardProduct $cardProduct): void
    {
        $this->initializeValues($cardProduct);

        CardLabel::create(
             [
                'card_product_id' => $cardProduct->id,
                'line_one' => $this->getFirstLine(),
                'line_two' => $this->getSecondLine(),
                'line_three' => $this->getThirdLine(),
                'line_four' => $this->getCardNumber(),
            ]
        );
    }

    protected function getCardNumber(): string
    {
        $card_number_order = $this->cardProduct->card_number_order ?? '';

        $card_number = '#';

        if(!Str::contains($card_number_order, ['CN'])){
            $card_number = '#'. $card_number_order;
        }

        if (
            $this->category->name == 'Pokemon' &&
            $this->cardProduct->language === 'English' &&
            Str::lower($this->cardSetName) == 'radiant collection'
        ){
            $card_number = '#RC' . $card_number_order;
        }

        return $card_number;
    }

    protected function getFirstLine(): string
    {
        $label_line_one = [];

        if(
            $this->category->name == 'Pokemon'
        ){
            if($this->cardProduct->language === 'English'){
                if (Str::contains($this->cardSeriesName, 'PROMOS') || Str::contains($this->cardSetName, 'PROMOS')) {
                    $label_line_one = [$this->year, $this->category->name, $this->cardProduct->getSeriesNickname(), 'PROMO'];

                    if(Str::contains($this->cardSetName, 'POP')){
                        $label_line_one = [$this->year, $this->category->name];
                    }
                }else if($this->year > 2002 || in_array($this->cardSetName, ['LEGENDARY COLLECTION', 'EXPEDITION'])){
                    if ($this->cardSetName === $this->cardSeriesName){
                        return implode(' ', [$this->year, $this->category->name]);
                    }

                    $label_line_one = $this->checkLineOneLength(
                        [$this->year, $this->category->name, $this->cardSeries->name]
                    );

                    if ($this->cardSetName == 'RADIANT COLLECTION'){
                        $label_line_one = [$this->year, $this->category->name, 'BW'];
                    }
                } else if ($this->year < 2002 or $this->cardSetName == 'NEO DESTINY'){
                    $label_line_one = $this->checkLineOneLengthOld([$this->year, $this->category->name, $this->cardProduct->getSetNickname()]);
                    if ($this->cardSetName == 'SOUTHERN ISLANDS'){
                        $label_line_one = [$this->year, $this->category->name, $this->cardProduct->getSetNickname()];
                    }

                } else{
                    $label_line_one = [$this->year, $this->category->name, $this->cardSeries->name, $this->cardSet->name, 'ERROR'];
                }
            }

            if($this->cardProduct->language === 'Japanese'){

                $language = $this->cardProduct->language;

                if(Str::contains($this->cardSeries->name, 'PROMOS')){
                    if ((strlen($this->year . $this->category->name . $language) + 5) < 22){
                        $label_line_one = [$this->year, $this->category->name, $language];
                    }else if (strlen($this->year . $this->cardProduct->getCategoryAbbreviation() . $language)  < 22){
                        $label_line_one = [$this->year, $this->category->name, $this->cardProduct->getLanguageAbbreviation()];
                    }else{
                        $label_line_one = [$this->year, strlen($this->cardProduct->getCategoryAbbreviation()), $this->cardProduct->getLanguageAbbreviation()];
                    }
                }else if ($this->year <= 2001 AND $this->cardSeries->name === 'E-CARD ERA'){
                    $label_line_one = [$this->year, $this->category->name, $language];
                }else if ($this->year >= 2001 AND $this->cardSeries->name !== 'NEO ERA'){

                    if ((strlen($this->year . $this->category->name . $language . $this->cardProduct->getSeriesNickname())) < 22){
                        $label_line_one = [$this->year, $this->category->name, $language, $this->cardProduct->getSeriesNickname()];
                    }else{
                        $label_line_one = [$this->year, $this->category->name, $this->cardProduct->getLanguageAbbreviation(), $this->cardProduct->getSeriesNickname()];
                    }

                }else{
                    $label_line_one = ['ERROR'];
                }
            }
        }else if ($this->category->name === "MetaZoo"){

            $full_date = Carbon::parse($this->cardSet->release_date_formatted);

            if($this->cardSeriesName === 'HOLIDAY SERIES' || Str::contains($this->cardSetName, ['DECK', 'BOX TOPPER', 'PIN CLUB'])){
                if (Str::contains($this->cardSetName, 'BOX TOPPER') AND $full_date->day === 30 AND $full_date->month === 7 AND $full_date->year === 2021){
                    $label_line_one = [$this->year, $this->category->name, 'CN'];
                }else if (Str::contains($this->cardSetName, 'DECK') AND $full_date->day === 30 AND $full_date->month === 7 AND $full_date->year === 2021){
                    $label_line_one = [$this->year, $this->category->name, 'CN'];
                }else if (Str::contains($this->cardSetName, 'DECK') AND $full_date->day === 22 AND $full_date->month === 10 AND $full_date->year === 2021){
                    $label_line_one = [$this->year, $this->category->name, 'NF'];
                }else if (Str::contains($this->cardSetName, 'PIN CLUB') AND $full_date->day === 17 AND $full_date->month === 9 AND $full_date->year === 2021){
                    $label_line_one = [$this->year, $this->category->name, 'CN'];
                }else{
                    $label_line_one = [$this->year, $this->category->name];
                }

            }else if($this->cardSeriesName === 'CRYPTID NATION' AND !Str::contains($this->cardSetName, 'PROMOS')){

                if(strlen($this->year . $this->category->name . $this->cardSet->name) < 30){
                    $label_line_one = [$this->year, $this->category->name, $this->cardSet->name];
                }else {
                    $label_line_one = [$this->year, $this->category->name, $this->cardProduct->getSetNickname()];
                }

            }else if(Str::contains($this->cardSetName, 'PROMOS')){

                $label_line_one = [$this->year, $this->category->name];

            }else{
                $label_line_one = ['ERROR'];
            }
        }

        return implode(' ', $label_line_one);
    }

    protected function getSecondLine(): string
    {
        $card_name = Str::upper($this->cardProduct->name);
        $surface = Str::upper($this->cardProduct->surface);

        if($this->category->name == 'Pokemon' && Str::contains($card_name, 'VMAX')){
            $card_name =  "FA/" . $card_name;
        }

        $label_line_two = [$card_name];

        if(!empty($surface)){
            $label_line_two = [$card_name, ' - ', $this->cardProduct->getSurfaceAbbreviation()];
        }

        return implode(' ', $label_line_two);
    }

    protected function getThirdLine(): string
    {
        $label_line_three = [];

        if($this->category->name == 'Pokemon'){

            if($this->cardProduct->language === 'English'){
                if (Str::contains($this->cardSeriesName, 'PROMOS') || Str::contains($this->cardSetName, 'PROMOS')) {
                    $label_line_three = ['BLACK STAR'];

                    if(Str::contains($this->cardSetName, 'POP')){
                        $label_line_three = [$this->cardSet->name];
                    }
                }else if($this->year > 2002 || in_array($this->cardSetName, ['LEGENDARY COLLECTION', 'EXPEDITION'])){

                    $label_line_three = [$this->cardSet->name];

                    if (str_starts_with($this->cardSetName, 'EX') AND $this->cardSetName != 'EX RUBY & SAPPHIRE'){
                        $label_line_three[0] =  substr($this->cardSet->name, 3);
                    }

                    if (Str::lower($this->cardSetName) == 'RADIANT COLLECTION'){
                        $label_line_three = ['LEGENDARY TREASURES'];
                    }
                } else if ($this->year < 2002 OR $this->cardSetName == 'NEO DESTINY'){

                    if(Str::upper($this->cardProduct->edition) === 'UNLIMITED'){

                        $label_line_three = ['\n'];
                    }else{
                        $label_line_three = [$this->cardProduct->edition];
                    }

                } else{
                    $label_line_three = ['ERROR'];
                }
            }

            if($this->cardProduct->language === 'JAPANESE') {
                if(Str::contains($this->cardSeries->name, 'PROMOS')){
                    $label_line_three = [$this->cardSet->name];
                }else if ($this->year <= 2001 AND $this->cardSeries->name === 'E-CARD ERA'){
                    $label_line_three = [$this->cardSet->name];
                }else if ($this->year >= 2001 AND $this->cardSeries->name !== 'NEO ERA'){

                    if($this->cardProduct->edition === 'UNLIMITED'){
                        $label_line_three = [$this->cardSet->name];
                    }else{
                        $label_line_three = [$this->cardSet->name, ' - ', $this->cardProduct->edition];
                    }
                }else{
                    $label_line_three = ['ERROR'];
                }
            }
        }else if ($this->category->name === "MetaZoo"){

            if($this->cardSeriesName === 'HOLIDAY SERIES' || Str::contains($this->cardSetName, ['DECK', 'BOX TOPPER', 'PIN CLUB'])){

                if(Str::upper($this->cardProduct->edition) === 'UNLIMITED'){
                    $label_line_three = [$this->cardSet->name];
                }else{
                    if ( ( strlen($this->cardSet->name . $this->cardProduct->edition) + 4 ) < 28 ){
                        $label_line_three = [$this->cardSet->name, ' - ', $this->cardProduct->edition];
                    }else{
                        $label_line_three = [$this->cardProduct->getSetNickname(), ' - ', $this->cardProduct->getEditionAbbreviation()];
                    }
                }

            }else if($this->cardSeriesName === 'CRYPTID NATION' AND !Str::contains($this->cardSetName, 'PROMOS')){

                if(Str::upper($this->cardProduct->edition) === 'UNLIMITED'){
                    $label_line_three = ['\n'];
                }else if(Str::upper($this->cardProduct->edition) === 'KICKSTARTER'){
                    $label_line_three = ['1ST ED', ' - ', $this->cardProduct->edition];
                } else{
                    $label_line_three = [$this->cardProduct->edition];
                }
            }else if(Str::contains($this->cardSetName, 'PROMOS')){

                if(Str::upper($this->cardProduct->edition) === 'UNLIMITED'){
                    if (strlen($this->cardSet->name) < 30){
                        $label_line_three = [$this->cardSet->name];
                    }else{
                        $label_line_three = [$this->cardProduct->getSetNickname()];
                    }
                }else if (Str::upper($this->cardProduct->edition) === 'KICKSTARTER'){
                    $label_line_three = [$this->cardProduct->getSetNickname(), ' - 1ST ED - ', $this->cardProduct->getEditionAbbreviation()];
                }else{
                    $label_line_three = [$this->cardProduct->getSetNickname(), ' - ', $this->cardProduct->getEditionAbbreviation()];
                }

            }else{
                $label_line_three = ['ERROR'];
            }
        }

        return implode(' ', $label_line_three);
    }

    protected function checkLineOneLength(array $label_line_one): array
    {
        $length = strlen(implode(' ', $label_line_one));
        if ($length > 20 AND count($label_line_one) > 2 AND (int) ($label_line_one[0])){
            $label_line_one[2] =  $this->cardProduct->getSeriesNickname();
        }

        if ($label_line_one[2] == 'EX Ruby & Sapphire'){
            $label_line_one[2] = $this->cardProduct->getSeriesNickname();
        }

        return $label_line_one;
    }

    protected function checkLineOneLengthOld(array $label_line_one): array
    {
        $length = strlen(implode('', $label_line_one));

        if ($length > 30 AND count($label_line_one) > 2 AND (int)($label_line_one[0])){
            $label_line_one[2] = $this->cardProduct->getSetNickname();
        }

        if (Str::lower($label_line_one[2]) == 'base set'){
            $label_line_one[2] = $this->cardProduct->getSetNickname();
        }

        if (Str::lower($label_line_one[2]) == 'base set 2'){
            $label_line_one[2] = $this->cardProduct->getSetNickname();
        }

        return $label_line_one;
    }
}
