<x-layout pageClass="page--pop-list">
    <section class="pop-hero">
        <div class="container pop-hero__container">
            <nav class="pop-hero__breadcrumbs">
                <ol class="pop-hero__breadcrumbs__list">
                    <li><a href="{{route('pop.categories', ['cardCategory' => $cardCategory->id])}}" class="pop-hero__breadcrumbs__list__link">{{ $cardCategory->name }} POP Report</a></li>
                    <li><span class="mx-2">/</span></li>
                    <li>{{$cardSeries->name}}</li>
                </ol>
            </nav>
        </div>
        <div class="container pop-hero__container">
            <aside class="pop-hero__logo">
                <div class="pop-hero__logo-image--holder">
                    <img class="pop-hero__logo-image" src="{{$cardSeries->image_path}}"
                         alt="Cards">
                </div>
            </aside>
            <aside class="pop-hero__text">
                <h1 class="pop-hero__text-series-heading">{{$cardSeries->name}}</h1>
                <h2 class="pop-hero__text-series-subheading"><b>Released:</b> {{Carbon\Carbon::parse($cardSeries->release_date)->format('m/d/Y')}}</h2>
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
                            @include('landings.pop.partials.common-table-headings')
                        </tr>
                    </thead>

                    <tbody class="pop-list__table-body">
                        @include('landings.pop.partials.total-population-row', $totalPopulation)
                        @foreach($data as $i => $cardSetsReport)
                            <tr class="pop-list__table-row">
                                <td class="pop-list__table-cell pop-list__table-cell--series">
                                    <a href="{{ route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]) }}" class="pop-list__table__info">
                                        <div class="pop-list__table__info-text">
                                            <p class="pop-list__table__info-heading">{{$cardSetsReport->name}}</p>
                                            <p class="pop-list__table__info-subheading">{{$cardSetsReport->release_date->format('m/d/Y')}}</p>
                                        </div>
                                    </a>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--grade-title">
                                    <a href="{{ route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]) }}">
                                    Grade
                                    <br/>
                                    +
                                    </a>
                                </td>
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => $cardSetsReport->pr, 'plusValue' => '-'])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => '-', 'plusValue' => $cardSetsReport->fr])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => $cardSetsReport->good, 'plusValue' => $cardSetsReport->good_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => $cardSetsReport->vg, 'plusValue' => $cardSetsReport->vg_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => $cardSetsReport->vg_ex, 'plusValue' => $cardSetsReport->vg_ex_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => $cardSetsReport->ex, 'plusValue' => $cardSetsReport->ex_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => $cardSetsReport->ex_mt, 'plusValue' => $cardSetsReport->ex_mt_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => $cardSetsReport->nm, 'plusValue' => $cardSetsReport->nm_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => $cardSetsReport->nm_mt, 'plusValue' => $cardSetsReport->nm_mt_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => $cardSetsReport->mint, 'plusValue' => $cardSetsReport->mint_plus])
                                @include('landings.pop.partials.value-cell',['href' => route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]), 'zeroValue' => $cardSetsReport->gem_mt, 'plusValue' => '-'])
                                <td class="pop-list__table-cell pop-list__table-cell--total">
                                    <a href="{{ route('pop.set', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSetsReport->card_series_id, 'cardSet' => $cardSetsReport->card_set_id]) }}">
                                        {{$cardSetsReport->total}}
                                        <br/>
                                        {{$cardSetsReport->total_plus}}
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            <x-tables.pagination :totals="$data->total()" :itemsPerPage="$data->perPage()" :currentPage="$data->currentPage()" :offset="($data->currentPage() - 1) * $data->perPage()" :basePath="route('pop.series', ['cardCategory' => $cardCategory->id, 'cardSeries' => $cardSeries])" />
        </div>
    </section>
</x-layout>
