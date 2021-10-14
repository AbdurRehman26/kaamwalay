<x-layout pageClass="page--pop-list">
    <section class="pop-hero">
        <div class="container pop-hero__container">
            <aside class="pop-hero__text">
                <h1 class="pop-hero__text-heading">Population Report</h1>
                <h2 class="pop-hero__text-subheading">A record of all cards RoboGraded by AGS.</h2>
            </aside>
            <aside class="pop-hero__splash">
                <img class="pop-hero__splash-image" src="{{ asset('assets/images/pop-hero-splash.png') }}"
                     alt="Cards">
            </aside>
        </div>
    </section>
    <section class="pop-list">
        <div class="container pop-list__container">
            <div class="pop-list__table-holder">
                <table class="pop-list__table">
                    <thead class="pop-list__table-head">
                        <tr class="pop-list__table-row">
                            <th class="pop-list__table-cell pop-list__table-cell--series">Series / Release Date</th>
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
                        @foreach($data as $i => $cardSeriesReport)
                            <tr class="pop-list__table-row">
                                <td class="pop-list__table-cell pop-list__table-cell--series">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}" class="pop-list__table__info">
                                        <div class="pop-list__table__info-text">
                                            <p class="pop-list__table__info-heading">{{$cardSeriesReport->name}}</p>
                                            <p class="pop-list__table__info-subheading">{{$cardSeriesReport->cardSeries->oldestReleaseDate->release_date}}</p>
                                        </div>
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--grade-title">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                    Grade
                                    <br/>
                                    +
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->pr}}
                                        <br/>
                                        -
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        -
                                        <br/>
                                        {{$cardSeriesReport->fr}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->good}}
                                        <br/>
                                        {{$cardSeriesReport->good_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->vg}}
                                        <br/>
                                        {{$cardSeriesReport->vg_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->vg_ex}}
                                        <br/>
                                        {{$cardSeriesReport->vg_ex_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->ex}}
                                        <br/>
                                        {{$cardSeriesReport->ex_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->ex_mt}}
                                        <br/>
                                        {{$cardSeriesReport->ex_mt_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->nm}}
                                        <br/>
                                        {{$cardSeriesReport->nm_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->nm_mt}}
                                        <br/>
                                        {{$cardSeriesReport->nm_mt_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->mint}}
                                        <br/>
                                        {{$cardSeriesReport->mint_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->gem_mt}}
                                        <br/>
                                        -
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--total">
                                    <a href="{{ route('pop.series', ['seriesId' => $cardSeriesReport->card_series_id]) }}">
                                        {{$cardSeriesReport->total}}
                                        <br/>
                                        {{$cardSeriesReport->total_plus}}
                                    </a>
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
