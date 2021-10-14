<x-layout pageClass="page--pop-list">
    <section class="pop-hero">
        <div class="container pop-hero__container">
            <nav class="pop-hero__breadcrumbs">
                <ol class="pop-hero__breadcrumbs__list">
                    <li><a href="{{route('pop.report')}}" class="pop-hero__breadcrumbs__list__link">Population Report</a></li>
                    <li><span class="mx-2">/</span></li>
                    <li><a href="{{route('pop.series', ['seriesId' => 1])}}" class="pop-hero__breadcrumbs__list__link">Sword and Shield Series</a></li>
                    <li><span class="mx-2">/</span></li>
                    <li>Chilling Reign</li>
                </ol>
            </nav>
        </div>
        <div class="container pop-hero__container">
            <aside class="pop-hero__logo">
                <img class="pop-hero__logo-image" src="{{ asset('assets/images/pop-hero-splash.png') }}"
                     alt="Cards">
            </aside>
            <aside class="pop-hero__text">
                <h1 class="pop-hero__text-series-heading">Chilling Reign</h1>
                <h2 class="pop-hero__text-series-subheading"><b>Released:</b> 11/15/2019</h2>
            </aside>
        </div>
    </section>
    <section class="pop-list">
        <div class="container pop-list__container">
            <div class="pop-list__table-holder">
                <table class="pop-list__table">
                    <thead class="pop-list__table-head">
                        <tr class="pop-list__table-row">
                            <th class="pop-list__table-cell pop-list__table-cell--card">Card / Release Date</th>
                            <th class="pop-list__table-cell pop-list__table-cell--grade-title"></th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                PR<br/>1
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                FR<br/>1.5
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                GOOD<br/>2
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                VG<br/>3
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                VG-EX<br/>4
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                EX<br/>5
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                EX-MT<br/>6
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                NM<br/>7
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                NM-MT<br/>8
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                MINT<br/>9
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--value">
                                GEM-MT<br/>10
                            </th>
                            <th class="pop-list__table-cell pop-list__table-cell--total">Total</th>
                        </tr>
                    </thead>

                    <tbody class="pop-list__table-body">
                        <tr class="pop-list__table-total-row">
                            <td class="pop-list__table-cell pop-list__table-cell--series">
                                <div class="pop-list__table__info-text">
                                    <p class="pop-list__table__info-heading">Total Population</p>
                                </div>
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--grade-title">
                                Grade
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                Grade
                                <br/>
                                -
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                -
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                Grade
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                Grade
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                Grade
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                Grade
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                Grade
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                Grade
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                Grade
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                Grade
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                Grade
                                <br/>
                                +
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--total">
                                Grade
                                <br/>
                                +
                            </td>
                        </tr>
                        @foreach($data as $i => $cardsReport)
                            <tr class="pop-list__table-row">
                                <td class="pop-list__table-cell pop-list__table-cell--card">
                                    <img class="pop-list__table__info-image" src="{{ $cardsReport->image_path }}" alt="Card" width="52" />
                                    <div class="pop-list__table__info-text">
                                        <p class="pop-list__table__info-heading">{{ $cardsReport->name }}</p>
                                        <p class="pop-list__table__info-subheading display-desktop">{{ $cardsReport->cardProduct->getSearchableName() }}</p>
                                        <p class="pop-list__table__info-subheading display-mobile">{{$cardsReport->card_number_order}}</p>
                                    </div>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--grade-title">
                                    Grade
                                    <br/>
                                    +
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    {{$cardsReport->pr}}
                                    <br/>
                                    -
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    -
                                    <br/>
                                    {{$cardsReport->fr}}
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    {{$cardsReport->good}}
                                    <br/>
                                    {{$cardsReport->good_plus}}
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    {{$cardsReport->vg}}
                                    <br/>
                                    {{$cardsReport->vg_plus}}
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    {{$cardsReport->vg_ex}}
                                    <br/>
                                    {{$cardsReport->vg_ex_plus}}
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    {{$cardsReport->ex}}
                                    <br/>
                                    {{$cardsReport->ex_plus}}
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    {{$cardsReport->ex_mt}}
                                    <br/>
                                    {{$cardsReport->ex_mt_plus}}
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    {{$cardsReport->nm}}
                                    <br/>
                                    {{$cardsReport->nm_plus}}
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    {{$cardsReport->nm_mt}}
                                    <br/>
                                    {{$cardsReport->nm_mt_plus}}
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    {{$cardsReport->mint}}
                                    <br/>
                                    {{$cardsReport->mint_plus}}
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    {{$cardsReport->gem_mt}}
                                    <br/>
                                    -
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--total">
                                    {{$cardsReport->total}}
                                    <br/>
                                    {{$cardsReport->total_plus}}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <x-tables.pagination :totals="$data->total()" :itemsPerPage="$data->perPage()" :currentPage="$data->currentPage()" :offset="($data->currentPage() - 1) * $data->perPage()" :basePath="route('pop.report')" />
            </div>
        </div>
    </section>
</x-layout>
