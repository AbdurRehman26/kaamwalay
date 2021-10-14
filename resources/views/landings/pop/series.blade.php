<x-layout pageClass="page--pop-list">
    <section class="pop-hero">
        <div class="container pop-hero__container">
            <nav class="pop-hero__breadcrumbs">
                <ol class="pop-hero__breadcrumbs__list">
                    <li><a href="{{route('pop.report')}}" class="pop-hero__breadcrumbs__list__link">Population Report</a></li>
                    <li><span class="mx-2">/</span></li>
                    <li>Sword and Shield Series</li>
                </ol>
            </nav>
        </div>
        <div class="container pop-hero__container">
            <aside class="pop-hero__logo">
                <img class="pop-hero__logo-image" src="{{ asset('assets/images/pop-hero-splash.png') }}"
                     alt="Cards">
            </aside>
            <aside class="pop-hero__text">
                <h1 class="pop-hero__text-series-heading">Sword & Shield Series</h1>
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
                            <th class="pop-list__table-cell pop-list__table-cell--series">Set / Release Date</th>
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
                                {{$totalPopulation->pr}}
                                <br/>
                                -
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                -
                                <br/>
                                {{$totalPopulation->fr_plus}}
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                {{$totalPopulation->good}}
                                <br/>
                                {{$totalPopulation->good_plus}}
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                {{$totalPopulation->vg}}
                                <br/>
                                {{$totalPopulation->vg_plus}}
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                {{$totalPopulation->vg_ex}}
                                <br/>
                                {{$totalPopulation->vg_ex_plus}}
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                {{$totalPopulation->ex}}
                                <br/>
                                {{$totalPopulation->ex_plus}}
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                {{$totalPopulation->ex_mt}}
                                <br/>
                                {{$totalPopulation->ex_mt_plus}}
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                {{$totalPopulation->nm}}
                                <br/>
                                {{$totalPopulation->nm_plus}}
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                {{$totalPopulation->nm_mt}}
                                <br/>
                                {{$totalPopulation->nm_mt_plus}}
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                {{$totalPopulation->mint}}
                                <br/>
                                -
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--value">
                                {{$totalPopulation->gem_mt}}
                                <br/>
                                -
                            </td>
                            <td class="pop-list__table-cell pop-list__table-cell--total">
                                {{$totalPopulation->total}}
                                <br/>
                                {{$totalPopulation->total_plus}}
                            </td>
                        </tr>
                        @foreach($data as $i => $cardSetsReport)
                            <tr class="pop-list__table-row">
                                <td class="pop-list__table-cell pop-list__table-cell--series">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}" class="pop-list__table__info">
                                        <div class="pop-list__table__info-text">
                                            <p class="pop-list__table__info-heading">{{$cardSetsReport->name}}</p>
                                            <p class="pop-list__table__info-subheading">{{$cardSetsReport->release_date}}</p>
                                        </div>
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--grade-title">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                    Grade
                                    <br/>
                                    +
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->pr}}
                                        <br/>
                                        -
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        -
                                        <br/>
                                        {{$cardSetsReport->fr_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->good}}
                                        <br/>
                                        {{$cardSetsReport->good_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->vg}}
                                        <br/>
                                        {{$cardSetsReport->vg_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->vg_ex}}
                                        <br/>
                                        {{$cardSetsReport->vg_ex_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->ex}}
                                        <br/>
                                        {{$cardSetsReport->ex_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->ex_mt}}
                                        <br/>
                                        {{$cardSetsReport->ex_mt_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->nm}}
                                        <br/>
                                        {{$cardSetsReport->nm_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->nm_mt}}
                                        <br/>
                                        {{$cardSetsReport->nm_mt_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->mint}}
                                        <br/>
                                        {{$cardSetsReport->mint_plus}}
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--value">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->gem_mt}}
                                        <br/>
                                        -
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--total">
                                    <a href="{{ route('pop.set', ['seriesId' => $cardSetsReport->card_series_id, 'setId' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->total}}
                                        <br/>
                                        {{$cardSetsReport->total_plus}}
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
