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
                            @include('landings.pop.partials.common-table-headings')
                        </tr>
                    </thead>

                    <tbody class="pop-list__table-body">
                        @include('landings.pop.partials.total-population-row', $totalPopulation)
                        @foreach($data as $i => $cardSeriesReport)
                            <tr class="pop-list__table-row">
                                <td class="pop-list__table-cell pop-list__table-cell--series">
                                    <a href="{{ route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]) }}" class="pop-list__table__info">
                                        <div class="pop-list__table__info-text">
                                            <p class="pop-list__table__info-heading">{{$cardSeriesReport->name}}</p>
                                            <p class="pop-list__table__info-subheading">{{$cardSeriesReport->cardSeries->oldestReleaseDate->release_date->format('m/d/Y')}}</p>
                                        </div>
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--grade-title">
                                    <a href="{{ route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]) }}">
                                    Grade
                                    <br/>
                                    +
                                    </a>
                                </td>
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => $cardSeriesReport->pr, 'plusValue' => '-'])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => '-', 'plusValue' => $cardSeriesReport->fr_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => $cardSeriesReport->good, 'plusValue' => $cardSeriesReport->good_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => $cardSeriesReport->vg, 'plusValue' => $cardSeriesReport->vg_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => $cardSeriesReport->vg_ex, 'plusValue' => $cardSeriesReport->vg_ex_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => $cardSeriesReport->ex, 'plusValue' => $cardSeriesReport->ex_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => $cardSeriesReport->ex_mt, 'plusValue' => $cardSeriesReport->ex_mt_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => $cardSeriesReport->nm, 'plusValue' => $cardSeriesReport->nm_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => $cardSeriesReport->nm_mt, 'plusValue' => $cardSeriesReport->nm_mt_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => $cardSeriesReport->mint, 'plusValue' => $cardSeriesReport->mint_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]), 'zeroValue' => $cardSeriesReport->gem_mt, 'plusValue' => '-'])

                                <td class="pop-list__table-cell pop-list__table-cell--total">
                                    <a href="{{ route('pop.series', ['cardSeries' => $cardSeriesReport->card_series_id]) }}">
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
