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
                        @foreach($data->items() as $item)
                            <tr class="feed-list__table-row">
                                <td class="feed-list__table-cell feed-list__table-cell--card">
                                    <a href="{{ route('feed.view', ['certificateId' => $item->certificate_number]) }}" class="feed-list__table__info">
                                        <img class="feed-list__table__info-image" src="{{ $item->orderItem->cardProduct->image_path }}" alt="Card" width="52" />
                                        <div class="feed-list__table__info-text">
                                            <p class="feed-list__table__info-heading">{{$item->orderItem->cardProduct->name}}</p>
                                            <p class="feed-list__table__info-subheading">{{$item->orderItem->cardProduct->getSearchableName()}}</p>
                                            <p class="feed-list__table__info-date">{{ $item->graded_at->format("m/d/Y h:i A") }}</p>
                                        </div>
                                    </a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--date">
                                    <a href="{{ route('feed.view', ['certificateId' => $item->certificate_number]) }}">
                                    {{ $item->graded_at->format("m/d/Y") }}
                                    <br/>
                                    {{ $item->graded_at->format("h:i A") }}
                                    </a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--certificate">
                                    <a href="{{ route('feed.view', ['certificateId' => $item->certificate_number]) }}">{{$item->certificate_number}}</a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--owner">
                                    <a href="{{ route('feed.view', ['certificateId' => $item->certificate_number]) }}">{{$item->user->username}}</a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--grade">
                                    <a href="{{ route('feed.view', ['certificateId' => $item->certificate_number]) }}" class="feed-list__grade">
                                        <p class="feed-list__grade__label">{{$item->overall_grade_nickname}}</p>
                                        <p class="feed-list__grade__value">{{$item->overall_grade}}</p>
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <x-tables.pagination :totals="$data->total()" :itemsPerPage="$data->perPage()" :currentPage="$data->currentPage()" :offset="($data->currentPage() - 1) * $data->perPage()" />
            </div>
        </div>
    </section>
</x-layout>
