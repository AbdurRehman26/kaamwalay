<?php

namespace App\Services\Admin\Order;

use App\Exceptions\Services\AGS\AgsServiceIsDisabled;
use App\Exceptions\Services\AGS\OrderLabelCouldNotBeGeneratedException;
use App\Exports\Order\OrdersLabelExport;
use App\Models\Order;
use App\Models\OrderLabel;
use App\Services\Admin\V1\OrderService;
use App\Services\AGS\AgsService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class OrderLabelService
{
    public function __construct(
        protected AgsService $agsService,
        protected OrderService $orderService
    ) {
    }

    /**
     * @throws AgsServiceIsDisabled
     * @throws OrderLabelCouldNotBeGeneratedException
     */
    public function generateLabel(Order $order): void
    {
        if (! $this->agsService->isEnabled()) {
            logger('Skipping AgsService as it is disabled.');

            throw new AgsServiceIsDisabled;
        }

        $certList = $this->orderService->getOrderCertificates($order);
//        $response = $this->agsService->createCardLabel([
//            'order_id' => $order->order_number,
//            'certificate_list' => $certList,
//        ]);

        $response = $this->getCardLabel($order);

        if (empty($response) || (isset($response['app_status']) && $response['app_status'] === 2)) {
            throw new OrderLabelCouldNotBeGeneratedException(json_encode($response));
        }

        $fileUrl = $this->generateFileAndUploadToCloud($order, $response);
        $this->saveCardLabel($order, $fileUrl);
    }

    protected function generateFileAndUploadToCloud(Order $order, array $response): string
    {
        $filePath = 'order-labels/' . $order->order_number . '_label_' . Str::uuid() . '.xlsx';
        Excel::store(new OrdersLabelExport($response), $filePath, 's3', \Maatwebsite\Excel\Excel::XLSX);

        return Storage::disk('s3')->url($filePath);
    }

    protected function saveCardLabel(Order $order, string $fileUrl): void
    {
        OrderLabel::updateOrCreate(
            [
                'order_id' => $order->id,
            ],
            [
                'path' => $fileUrl,
            ]
        );
    }

    public function getCardLabel(Order $order): array
    {
        foreach ($order->orderItems as $orderItem){
            $overallGrades = $orderItem->userCard->overall_grade;
            $cardProduct = $orderItem->cardProduct;
            $cardSet = $cardProduct->cardSet;
            $category = $cardProduct->cardCategory;
            $cardSeries = $cardSet->cardSeries;


            $year = $cardSet->release_year;
            $full_date = $cardSet->release_date_formatted;

            $category_name = Str::upper($category->name);
            $series_name = Str::upper($cardSeries->name);
            $set_name = Str::upper($cardSet->name);
            $card_name = Str::upper($cardProduct->name);
            $edition = Str::upper($cardProduct->edition);
            $surface = Str::upper($cardProduct->surface);
            $language = Str::upper($cardProduct->language);
            $card_number_order = $cardProduct->card_number_order ?? '';
            $label_line_one = [];
            $label_line_two = [];
            $label_line_three = [];

            $CONST_FULL_ART = "FA/";

            $card_number = '#';
            if(!Str::contains($card_number_order, ['CN'])){
                $card_number = '#'. $card_number_order;
            }

            if($category_name === 'POKEMON'){

                if(Str::contains($card_name, 'VMAX')){
                    $card_name = $CONST_FULL_ART . $card_name;
                }

                if($language === 'ENGLISH'){
                    if(Str::contains($series_name, 'PROMOS') || Str::contains($set_name, 'PROMOS')){
                        $label_line_one = [$year, $category_name, $this->get_series_nickname($category_name, $series_name), 'PROMO'];
                        $label_line_three = ['BLACK STAR'];
                        if(Str::contains($set_name, 'POP')){
                            $label_line_one = [$year, $category_name];
                            $label_line_three = [$set_name];
                        }
                    }else if($year > 2002 || $set_name === 'LEGENDARY COLLECTION' || $set_name === 'EXPEDITION'){

                    $label_line_one = [$year, $category_name, $series_name];
                    $label_line_one = $this->check_line_one_length($category_name, $label_line_one)
                    $label_line_three = [$set_name];

                    if (str_starts_with($set_name, 'EX') and Str::lower($set_name) != 'ex ruby & sapphire'){
                        $label_line_three[0] =  substr($set_name, 3);
                    }

                    if (Str::lower($set_name) == 'radiant collection'){
                        $label_line_one = [$year, $category_name, 'BW'];
                        $label_line_three = ['LEGENDARY TREASURES'];
                        $card_number = '#RC' . $card_number_order;
                    }

                    # Rule #1: If Series Name == Set name, ignore the series on teh first line.
                    if ($series_name === $set_name){
                        $label_line_one = [$year, $category_name];
                    }


                    }


                }


            if language == 'ENGLISH':
                if 'PROMOS' in serie_name or 'PROMOS' in set_name:
                    label_line_one = [year, category_name, self._get_series_nickname(category_name, serie_name), 'PROMO']
                    label_line_three = ['BLACK STAR']
                    if 'POP' in set_name:
                        label_line_one = [year, category_name]
                        label_line_three = [set_name]

                elif int(year) > 2002 or set_name == 'LEGENDARY COLLECTION' or set_name == 'EXPEDITION':
                    label_line_one = [year, category_name, serie_name]
                    label_line_one = self._check_line_one_length(category_name, label_line_one)
                    label_line_three = [set_name]

                    if set_name[:2] == 'EX' and set_name.lower() != 'ex ruby & sapphire':
                        label_line_three[0] = set_name[3:]

                    if set_name.lower() == 'radiant collection':
                        label_line_one = [year, category_name, 'BW']
                        label_line_three = ['LEGENDARY TREASURES']
                        card_number = '#RC' + card_number_order

                    # Rule #1: If Series Name == Set name, ignore the series on teh first line.
                    if serie_name == set_name:
                        label_line_one = [year, category_name]

                elif int(year) < 2002 or set_name == 'NEO DESTINY':
                    label_line_one = [year, category_name, self._get_set_nickname(category_name, set_name)]
                    label_line_one = self._check_line_one_length_old(category_name, label_line_one)
                    if edition == 'UNLIMITED':
                        label_line_three = '\n'
                    else:
                        label_line_three = edition

                    if set_name.lower() == 'southern islands':
                        label_line_one = [year, category_name, self._get_set_nickname(category_name, set_name)]
                        label_line_three = ['PROMO']
                else:
                    label_line_one = [year, category_name, serie_name, set_name, 'ERROR']

                if surface != '' and surface != None:
                    surface_nickname = self._get_surface_abbreviation(surface)
                    label_line_two = [card_name, ' - ', surface_nickname]
                else:
                    label_line_two = [card_name]

            if language == 'JAPANESE':
                if 'PROMOS' in serie_name:
                    if len(year) + len(category_name) + len(language) + 5 < 22:
                        label_line_one = [year, category_name, language]
                    elif len(year) + len(self._get_category_abbreviation(category_name)) + len(language) < 22:
                        label_line_one = [year, category_name, self._get_language_abbreviation(language)]
                    else:
                        label_line_one = [year, len(self._get_category_abbreviation(category_name)), self._get_language_abbreviation(language)]
                    label_line_three = [set_name]

                elif int(year) <= 2001 and serie_name != 'E-CARD ERA':
                    label_line_one = [year, category_name, language]
                    label_line_three = [set_name]

                elif int(year) >= 2001 and serie_name != 'NEO ERA':
                    if len(year) + len(category_name) + len(language) + len(self._get_series_nickname(category_name, serie_name)) < 22:
                        label_line_one = [year, category_name, language, self._get_series_nickname(category_name, serie_name)]
                    else:
                        label_line_one = [year, category_name, self._get_language_abbreviation(language), self._get_series_nickname(category_name, serie_name)]

                    if edition == 'UNLIMITED':
                        label_line_three = [set_name]
                    else:
                        label_line_three = [set_name, ' - ', edition]
                else:
                    label_line_one = ['ERROR']
                    label_line_three = ['ERROR']

            if surface != '' and surface != None:
                surface_nickname = self._get_surface_abbreviation(surface)
                label_line_two = [card_name, ' - ', surface_nickname]
            else:
                label_line_two = [card_name]

            }




            if($category->name === 'Pokemon'){

            }


            dd($overallGrades);


            dd($orderItem);

            $label_line_one = [

            ];

        }
    }
}
