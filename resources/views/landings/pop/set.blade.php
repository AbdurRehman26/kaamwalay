<x-layout pageClass="page--pop-list">
    <section class="pop-hero">
        <div class="container pop-hero__container">
            <nav class="pop-hero__breadcrumbs">
                <ol class="pop-hero__breadcrumbs__list">
                    <li><a href="{{route('pop.report')}}" class="pop-hero__breadcrumbs__list__link">Population Report</a></li>
                    <li><span class="mx-2">/</span></li>
                    <li><a href="{{route('pop.series', ['cardSeries' => $cardSet->card_series_id])}}" class="pop-hero__breadcrumbs__list__link">{{$cardSet->cardSeries->name}}</a></li>
                    <li><span class="mx-2">/</span></li>
                    <li>{{$cardSet->name}}</li>
                </ol>
            </nav>
        </div>
        <div class="container pop-hero__container">
            <aside class="pop-hero__logo">
                <div class="pop-hero__logo-image--holder">
                    <img class="pop-hero__logo-image" src="{{$cardSet->image_path}}"
                        alt="Cards">
                </div>
            </aside>
            <aside class="pop-hero__text">
                <h1 class="pop-hero__text-series-heading">{{$cardSet->name}}</h1>
                <h2 class="pop-hero__text-series-subheading"><b>Released:</b> {{$cardSet->release_date->format('m/d/Y')}}</h2>
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
                            @include('landings.pop.partials.common-table-headings')
                        </tr>
                    </thead>

                    <tbody class="pop-list__table-body">
                        @include('landings.pop.partials.total-population-row', $totalPopulation)
                        @foreach($data as $i => $cardsReport)
                            <tr class="pop-list__table-row">
                                <td class="pop-list__table-cell pop-list__table-cell--card">
                                    <div class="pop-list__table-cell--card-content">
                                        <img class="pop-list__table__info-image" src="{{ $cardsReport->image_path }}" alt="Card" width="52" />
                                        <div class="pop-list__table__info-text">
                                            <p class="pop-list__table__info-heading">{{ $cardsReport->cardProduct->getShortName() }}</p>
                                            <p class="pop-list__table__info-subheading display-desktop">{{ $cardsReport->cardProduct->getSearchableName() }}</p>
                                            <p class="pop-list__table__info-subheading display-mobile">{{$cardsReport->card_number_order}}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="pop-list__table-cell pop-list__table-cell--grade-title">
                                    Grade
                                    <br/>
                                    +
                                </td>
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $cardsReport->pr, 'plusValue' => '-'])
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => '-', 'plusValue' => $cardsReport->fr_plus])
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $cardsReport->good, 'plusValue' => $cardsReport->good_plus])
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $cardsReport->vg, 'plusValue' => $cardsReport->vg_plus])
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $cardsReport->vg_ex, 'plusValue' => $cardsReport->vg_ex_plus])
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $cardsReport->ex, 'plusValue' => $cardsReport->ex_plus])
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $cardsReport->ex_mt, 'plusValue' => $cardsReport->ex_mt_plus])
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $cardsReport->nm, 'plusValue' => $cardsReport->nm_plus])
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $cardsReport->nm_mt, 'plusValue' => $cardsReport->nm_mt_plus])
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $cardsReport->mint, 'plusValue' => $cardsReport->mint_plus])
                                @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $cardsReport->gem_mt, 'plusValue' => '-'])
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
