<x-layout pageClass="page--pop-list">
    <section class="pop-hero">
        <div class="container pop-hero__container">
            <nav class="pop-hero__breadcrumbs">
                <ol class="pop-hero__breadcrumbs__list">
                    <li><a href="{{route('pop.report')}}" class="pop-hero__breadcrumbs__list__link">Population Report</a></li>
                    <li><span class="mx-2">/</span></li>
                    <li><a href="{{route('pop.series', ['cardSeries' => 1])}}" class="pop-hero__breadcrumbs__list__link">Sword and Shield Series</a></li>
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
                        @for($i = 0; $i < 10; $i++)
                            <tr class="pop-list__table-row">
                                <td class="pop-list__table-cell pop-list__table-cell--card">
                                    <img class="pop-list__table__info-image" src="{{ asset('assets/images/card-preview.png') }}" alt="Card" width="52" />
                                    <div class="pop-list__table__info-text">
                                        <p class="pop-list__table__info-heading">{{ 'Charizard' }}</p>
                                        <p class="pop-list__table__info-subheading display-desktop">{{'2020 Pokemon Sword & Shield Chilling Reign 025 Charizard'}}</p>
                                        <p class="pop-list__table__info-subheading display-mobile">{{'025'}}</p>
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
                        @endfor
                    </tbody>
                </table>
                <x-tables.pagination/>
            </div>
        </div>
    </section>
</x-layout>
