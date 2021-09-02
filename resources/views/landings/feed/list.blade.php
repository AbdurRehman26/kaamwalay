<x-layout pageClass="page--feed-list">
    <section class="feed-hero">
        <div class="container feed-hero__container">
            <aside class="feed-hero__text">
                <h1 class="feed-hero__text-heading">Robograding Feed</h1>
                <h2 class="feed-hero__text-subheading">Get a live view of all cards we grade.</h2>
            </aside>
            <aside class="feed-hero__splash">
                <img class="feed-hero__splash-image" src="{{ asset('assets/images/feed-hero-splash.jpeg') }}"
                     alt="Cards">
            </aside>
        </div>
    </section>
    <section class="feed-list">
        <div class="container feed-list__container">
            <div class="feed-list__table-holder">
                <table class="feed-list__table">
                    <thead class="feed-list__table-head">
                        <tr class="feed-list__table-row">
                            <th class="feed-list__table-cell feed-list__table-cell--card">Card</th>
                            <th class="feed-list__table-cell feed-list__table-cell--date">Date</th>
                            <th class="feed-list__table-cell feed-list__table-cell--certificate">Certificate #</th>
                            <th class="feed-list__table-cell feed-list__table-cell--owner">Owner</th>
                            <th class="feed-list__table-cell feed-list__table-cell--grade">Grade</th>
                        </tr>
                    </thead>

                    <tbody class="feed-list__table-body">
                        @for($i = 0; $i < 10; $i++)
                            <tr class="feed-list__table-row">
                                <td class="feed-list__table-cell feed-list__table-cell--card">
                                    <a href="{{ route('feed.view', ['id' => $i]) }}" class="feed-list__table__info">
                                        <img class="feed-list__table__info-image" src="{{ asset('assets/images/card-preview.png') }}" alt="Card" width="52" />
                                        <div class="feed-list__table__info-text">
                                            <p class="feed-list__table__info-heading">Charizard</p>
                                            <p class="feed-list__table__info-subheading">2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard</p>
                                        </div>
                                    </a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--date">
                                    <a href="{{ route('feed.view', ['id' => $i]) }}">
                                    {{ \Carbon\Carbon::now()->format("m/d/Y") }}
                                    <br/>
                                    {{ \Carbon\Carbon::now()->format("h:i A") }}
                                    </a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--certificate">
                                    <a href="{{ route('feed.view', ['id' => $i]) }}">AG676739</a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--owner">
                                    <a href="{{ route('feed.view', ['id' => $i]) }}">JonDoe24</a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--grade">
                                    <a href="{{ route('feed.view', ['id' => $i]) }}" class="feed-list__grade">
                                        <p class="feed-list__grade__label">MINT</p>
                                        <p class="feed-list__grade__value">9.5</p>
                                    </a>
                                </td>
                            </tr>
                        @endfor
                    </tbody>
                </table>
                <x-tables.pagination />
            </div>
        </div>
    </section>
</x-layout>
