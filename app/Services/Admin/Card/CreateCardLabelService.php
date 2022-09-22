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
    protected string $editionName;
    protected string $language;
    protected string $categoryName;
    protected int $year;

    public function createLabelsForOrder(Order $order): void
    {
        foreach ($order->orderItems as $orderItem) {
            if ($orderItem->canCreateLabel()) {
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
        $this->editionName = Str::upper($this->cardProduct->edition);
        $this->language = Str::upper($this->cardProduct->language);
        $this->categoryName = Str::upper($cardProduct->cardCategory->name);
    }

    protected function createLabel(CardProduct $cardProduct): void
    {
        $this->initializeValues($cardProduct);

        CardLabel::create($this->getCardLabel($cardProduct));
    }

    protected function getCardLabel(CardProduct $cardProduct): array
    {
        return [
            'card_product_id' => $cardProduct->id,
            'line_one' => $this->getFirstLine(),
            'line_two' => $this->getSecondLine(),
            'line_three' => $this->getThirdLine(),
            'line_four' => $this->getCardNumber(),
        ];
    }

    protected function getCardNumber(): string
    {
        $card_number_order = $this->cardProduct->card_number_order ?? '';

        $card_number = '#';

        if (! Str::contains($card_number_order, ['CN'])) {
            $card_number = '#'. $card_number_order;
        }

        if (
            $this->categoryName == 'POKEMON' &&
            $this->language === 'ENGLISH' &&
            Str::lower($this->cardSetName) == 'radiant collection'
        ) {
            $card_number = '#RC' . $card_number_order;
        }

        return $card_number;
    }

    protected function getFirstLine(): string
    {
        $label_line_one = [];

        $categoryName = Str::upper($this->category->name);

        if (
            $this->categoryName == 'POKEMON'
        ) {
            if ($this->language === 'ENGLISH') {
                if (Str::contains($this->cardSeriesName, 'PROMOS') || Str::contains($this->cardSetName, 'PROMOS')) {
                    $label_line_one = [$this->year, $categoryName, $this->cardProduct->getSeriesNickname(), 'PROMO'];

                    if (Str::contains($this->cardSetName, 'POP')) {
                        $label_line_one = [$this->year, $categoryName];
                    }
                } elseif ($this->year > 2002 || in_array($this->cardSetName, ['LEGENDARY COLLECTION', 'EXPEDITION'])) {
                    if ($this->cardSetName === $this->cardSeriesName) {
                        return implode(' ', [$this->year, $categoryName]);
                    }

                    $label_line_one = $this->checkLineOneLength(
                        [$this->year, $categoryName, $this->cardSeries->name]
                    );

                    if ($this->cardSetName == 'RADIANT COLLECTION') {
                        $label_line_one = [$this->year, $categoryName, 'BW'];
                    }
                } elseif ($this->year < 2002 || $this->cardSetName == 'NEO DESTINY') {
                    $label_line_one = $this->checkLineOneLengthOld([$this->year, $categoryName, $this->cardProduct->getSetNickname()]);
                    if ($this->cardSetName == 'SOUTHERN ISLANDS') {
                        $label_line_one = [$this->year, $categoryName, $this->cardProduct->getSetNickname()];
                    }
                } else {
                    $label_line_one = [$this->year, $categoryName, $this->cardSeriesName, $this->cardSetName, 'ERROR'];
                }
            }

            if ($this->language === 'JAPANESE') {
                if (Str::contains($this->cardSeriesName, 'PROMOS')) {
                    if ((strlen($this->year . $categoryName . $this->language) + 5) < 22) {
                        $label_line_one = [$this->year, $categoryName, $this->language];
                    } elseif (strlen($this->year . $this->cardProduct->getCategoryAbbreviation() . $this->language) < 22) {
                        $label_line_one = [$this->year, $categoryName, $this->cardProduct->getLanguageAbbreviation()];
                    } else {
                        $label_line_one = [$this->year, strlen($this->cardProduct->getCategoryAbbreviation()), $this->cardProduct->getLanguageAbbreviation()];
                    }
                } elseif ($this->year <= 2001 && $this->cardSeriesName !== 'E-CARD ERA') {
                    $label_line_one = [$this->year, $categoryName, $this->language];
                } elseif ($this->year >= 2001 && $this->cardSeriesName !== 'NEO ERA') {
                    if ((strlen($this->year . $categoryName . $this->language . $this->cardProduct->getSeriesNickname())) < 22) {
                        $label_line_one = [$this->year, $categoryName, $this->language, $this->cardProduct->getSeriesNickname()];
                    } else {
                        $label_line_one = [$this->year, $categoryName, $this->cardProduct->getLanguageAbbreviation(), $this->cardProduct->getSeriesNickname()];
                    }
                } else {
                    $label_line_one = ['ERROR'];
                }
            }
        } elseif ($this->categoryName == 'METAZOO') {
            $full_date = Carbon::parse($this->cardSet->release_date_formatted);

            if ($this->cardSeriesName === 'HOLIDAY SERIES' || Str::contains($this->cardSetName, ['DECK', 'BOX TOPPER', 'PIN CLUB'])) {
                if (Str::contains($this->cardSetName, 'BOX TOPPER') && $full_date->day === 30 && $full_date->month === 7 && $full_date->year === 2021) {
                    $label_line_one = [$this->year, $categoryName, 'CN'];
                } elseif (Str::contains($this->cardSetName, 'DECK') && $full_date->day === 30 && $full_date->month === 7 && $full_date->year === 2021) {
                    $label_line_one = [$this->year, $categoryName, 'CN'];
                } elseif (Str::contains($this->cardSetName, 'DECK') && $full_date->day === 22 && $full_date->month === 10 && $full_date->year === 2021) {
                    $label_line_one = [$this->year, $categoryName, 'NF'];
                } elseif (Str::contains($this->cardSetName, 'PIN CLUB') && $full_date->day === 17 && $full_date->month === 9 && $full_date->year === 2021) {
                    $label_line_one = [$this->year, $categoryName, 'CN'];
                } else {
                    $label_line_one = [$this->year, $categoryName];
                }
            } elseif ($this->cardSeriesName === 'CRYPTID NATION' && ! Str::contains($this->cardSetName, 'PROMOS')) {
                if (strlen($this->year . $categoryName . $this->cardSet->name) < 30) {
                    $label_line_one = [$this->year, $categoryName, $this->cardSetName];
                } else {
                    $label_line_one = [$this->year, $categoryName, $this->cardProduct->getSetNickname()];
                }
            } elseif (Str::contains($this->cardSetName, 'PROMOS')) {
                $label_line_one = [$this->year, $categoryName];
            } else {
                $label_line_one = ['ERROR'];
            }
        } elseif ($this->category->isTCG()) {
            $label_line_one = [$this->year, $this->category->name];
        } elseif ($this->category->isSports()) {
            $label_line_one = [$this->year, $this->cardSeries->name, $this->cardSet->name];
        }

        return implode(' ', $label_line_one);
    }

    protected function getSecondLine(): string
    {
        $card_name = Str::upper($this->cardProduct->name);
        $surface = Str::upper($this->cardProduct->surface);

        if ($this->categoryName == 'POKEMON' && Str::contains($card_name, 'VMAX')) {
            $card_name = "FA/" . $card_name;
        }

        $label_line_two = [$card_name];

        if (! empty($surface)) {
            $label_line_two = [$card_name, '-', $this->cardProduct->getSurfaceAbbreviation()];
        }

        return implode(' ', $label_line_two);
    }

    protected function getThirdLine(): string
    {
        $label_line_three = [];
        if ($this->categoryName == 'POKEMON') {
            if ($this->language === 'ENGLISH') {
                if (Str::contains($this->cardSeriesName, 'PROMOS') || Str::contains($this->cardSetName, 'PROMOS')) {
                    $label_line_three = ['BLACK STAR'];

                    if (Str::contains($this->cardSetName, 'POP')) {
                        $label_line_three = [$this->cardSetName];
                    }
                } elseif ($this->year > 2002 || in_array($this->cardSetName, ['LEGENDARY COLLECTION', 'EXPEDITION'])) {
                    $label_line_three = [$this->cardSetName];

                    if (str_starts_with($this->cardSetName, 'EX') && $this->cardSetName != 'EX RUBY & SAPPHIRE') {
                        $label_line_three[0] = substr($this->cardSetName, 3);
                    }

                    if (Str::lower($this->cardSetName) == 'RADIANT COLLECTION') {
                        $label_line_three = ['LEGENDARY TREASURES'];
                    }
                } elseif ($this->year < 2002 || $this->cardSetName == 'NEO DESTINY') {
                    if ($this->editionName === 'UNLIMITED') {
                        $label_line_three = ["\n"];
                    } else {
                        $label_line_three = [$this->editionName];
                    }
                } else {
                    $label_line_three = ['ERROR'];
                }
            }

            if ($this->language === 'JAPANESE') {
                if (Str::contains($this->cardSeriesName, 'PROMOS')) {
                    $label_line_three = [$this->cardSetName];
                } elseif ($this->year <= 2001 && $this->cardSeriesName !== 'E-CARD ERA') {
                    $label_line_three = [$this->cardSetName];
                } elseif ($this->year >= 2001 && $this->cardSeriesName !== 'NEO ERA') {
                    if ($this->editionName === 'UNLIMITED') {
                        $label_line_three = [$this->cardSetName];
                    } else {
                        $label_line_three = [$this->cardSetName, '-', $this->editionName];
                    }
                } else {
                    $label_line_three = ['ERROR'];
                }
            }
        } elseif ($this->categoryName == 'METAZOO') {
            if ($this->cardSeriesName === 'HOLIDAY SERIES' || Str::contains($this->cardSetName, ['DECK', 'BOX TOPPER', 'PIN CLUB'])) {
                if ($this->editionName === 'UNLIMITED') {
                    $label_line_three = [$this->cardSetName];
                } else {
                    if ((strlen($this->cardSet->name . $this->cardProduct->edition) + 4) < 28) {
                        $label_line_three = [$this->cardSetName, '-', $this->editionName];
                    } else {
                        $label_line_three = [$this->cardProduct->getSetNickname(), ' - ', $this->cardProduct->getEditionAbbreviation()];
                    }
                }
            } elseif ($this->cardSeriesName === 'CRYPTID NATION' && ! Str::contains($this->cardSetName, 'PROMOS')) {
                if ($this->editionName === 'UNLIMITED') {
                    $label_line_three = ["\n"];
                } elseif ($this->editionName === 'KICKSTARTER') {
                    $label_line_three = ['1ST ED', '-', $this->editionName];
                } else {
                    $label_line_three = [$this->editionName];
                }
            } elseif (Str::contains($this->cardSetName, 'PROMOS')) {
                if ($this->editionName === 'UNLIMITED') {
                    if (strlen($this->cardSet->name) < 30) {
                        $label_line_three = [$this->cardSetName];
                    } else {
                        $label_line_three = [$this->cardProduct->getSetNickname()];
                    }
                } elseif ($this->editionName === 'KICKSTARTER') {
                    $label_line_three = [$this->cardProduct->getSetNickname(), ' - 1ST ED - ', $this->cardProduct->getEditionAbbreviation()];
                } else {
                    $label_line_three = [$this->cardProduct->getSetNickname(), ' - ', $this->cardProduct->getEditionAbbreviation()];
                }
            } else {
                $label_line_three = ['ERROR'];
            }
        } elseif ($this->category->isTCG()) {
            $label_line_three = [$this->cardSet->name];

            $editionAbbreviation = $this->cardProduct->getEditionAbbreviation();
            if ($editionAbbreviation) {
                $label_line_three = array_merge($label_line_three, ['-', $editionAbbreviation]);
            }
            if ($this->cardProduct->surface) {
                $label_line_three = array_merge($label_line_three, ['-', $this->cardProduct->getSurfaceAbbreviation()]);
            }
            if ($this->cardProduct->variant) {
                $label_line_three = array_merge($label_line_three, ['-', $this->cardProduct->variant]);
            }
        } elseif ($this->category->isSports()) {
            $editionAbbreviation = $this->cardProduct->getEditionAbbreviation();

            if ($editionAbbreviation) {
                $label_line_three[] = $editionAbbreviation;
            }
            if ($this->cardProduct->surface) {
                if (count($label_line_three) > 0) {
                    $label_line_three[] = '-';
                }
                $label_line_three[] = strlen($this->cardProduct->getSurfaceAbbreviation()) > 0 ? $this->cardProduct->getSurfaceAbbreviation() : $this->cardProduct->surface;
            }
            if ($this->cardProduct->variant) {
                if (count($label_line_three) > 0) {
                    $label_line_three[] = '-';
                }
                $label_line_three[] = $this->cardProduct->variant;
            }
        }

        return implode(' ', $label_line_three);
    }

    protected function checkLineOneLength(array $label_line_one): array
    {
        $length = strlen(implode(' ', $label_line_one));
        if ($length > 20 && count($label_line_one) > 2 && (int) ($label_line_one[0])) {
            $label_line_one[2] = $this->cardProduct->getSeriesNickname();
        }

        if ($label_line_one[2] == 'EX Ruby & Sapphire') {
            $label_line_one[2] = $this->cardProduct->getSeriesNickname();
        }

        return $label_line_one;
    }

    protected function checkLineOneLengthOld(array $label_line_one): array
    {
        $length = strlen(implode('', $label_line_one));

        if ($length > 30 && count($label_line_one) > 2 && (int)($label_line_one[0])) {
            $label_line_one[2] = $this->cardProduct->getSetNickname();
        }

        if (Str::lower($label_line_one[2]) == 'base set') {
            $label_line_one[2] = $this->cardProduct->getSetNickname();
        }

        if (Str::lower($label_line_one[2]) == 'base set 2') {
            $label_line_one[2] = $this->cardProduct->getSetNickname();
        }

        return $label_line_one;
    }
}
