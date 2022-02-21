<x-layout pageClass="page--feed-list">
    <x-slot name="head">
        <script src="https://cdn.jsdelivr.net/npm/algoliasearch@4.5.1/dist/algoliasearch-lite.umd.js" integrity="sha256-EXPXz4W6pQgfYY3yTpnDa3OH8/EPn16ciVsPQ/ypsjk=" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4.8.3/dist/instantsearch.production.min.js" integrity="sha256-LAGhRRdtVoD6RLo2qDQsU2mp+XVSciKRC8XPOBWmofM=" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tw-elements/dist/css/index.min.css" />
        <script src="https://cdn.tailwindcss.com"></script>
    </x-slot>
    <x-slot name="body">
        <script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js"></script>
        <script>
            const searchClient = algoliasearch(
                '{{ config("scout.algolia.id") }}',
                '085cc30e0d991ab2aa990615163f86c5'
                );

            const search = instantsearch({
                indexName: 'local_user_cards',
                searchClient,
            });

            var grid = document.getElementsByClassName("feed-grid");
            var list = document.getElementsByClassName("feed-list");
            var grid_icon = document.getElementsByClassName("feed-categories__grid-view-icon");
            var list_icon = document.getElementsByClassName("feed-categories__list-view-icon");
            var mobile_display = document.getElementsByClassName("feed-stats__sort-and-filter-mobile");
            list[0].style.display = "none";

            function listView() {
                if (list[0].style.display === "none") {
                    grid_icon[0].style.backgroundColor = "" ;
                    list_icon[0].style.backgroundColor =  "#DCDCDC";
                    list[0].style.display = "block";
                    grid[0].style.display = "none";
                }
            }

            function gridView() {
                if (grid[0].style.display === "none") {
                    grid_icon[0].style.backgroundColor =  "#DCDCDC";
                    list_icon[0].style.backgroundColor =  "";
                    grid[0].style.display = "block";
                    list[0].style.display = "none";
                }
            }

            function openFilterSort() {
                mobile_display[0].style.width = "100%";
            }

            function closeFilterSort() {
                mobile_display[0].style.width = "0%";
            }

        </script>
            @include('landings.feed.partials.scripts.search')
            @include('landings.feed.partials.scripts.categories')
            @include('landings.feed.partials.scripts.grade')
            @include('landings.feed.partials.scripts.sort')
            @include('landings.feed.partials.scripts.cards-grid-view')
            @include('landings.feed.partials.scripts.cards-list-view')
            @include('landings.feed.partials.scripts.pagination')
            @include('landings.feed.partials.scripts.stats')
            @include('landings.feed.partials.scripts.items-per-page')
            @include('landings.feed.partials.scripts.current-refinement')
            @include('landings.feed.partials.scripts.mobile-view')
    </x-slot>
    <section class="feed-hero">
        <div class="container feed-hero__container">
            <div class="feed-hero__text">
                <h1 class="feed-hero__text-heading">Robograding Feed</h1>
                <h2 class="feed-hero__text-subheading">See all the cards we've graded.</h2>
                <div class="feed-hero__search-box" ></div>
            </div>
        </div>
    </section>
    <section class="feed-categories">
        <div class="container feed-categories__container">
            <div class="feed-categories__filters">
                <div class="feed-categories__clear-refinements" ></div>
                <div class="feed-categories__refinement-list"></div>
                <div class="feed-categories__menu-select"></div>
            </div>
            <div class="feed-categories__views">
                <div>
                    <button class="feed-categories__list-view-button" onclick="listView()">
                        <span class="feed-categories__list-view-icon material-icons">density_small</span>
                    </button>
                    <button class="feed-categories__grid-view-button" onclick="gridView()">
                        <span class="feed-categories__grid-view-icon material-icons">grid_view</span>
                    </button>
                </div>
                <div class="feed-categories__sort-by-container">
                    <p style="margin-left: 10px;">sort</p>
                    <span class="feed-categories__sort-by"></span>
                </div>
            </div>
        </div>
    </section>
    <section class="feed-stats">
        <div class="container feed-stats__container">
            <div class="feed-stats__text"></div>
            <button class="feed-stats__sort-and-filter" onclick="openFilterSort()">
                <span class="feed-stats__icon material-icons">filter_alt</span>
                Sort & Filter
                <span class="feed-stats__sort-count"></span>
            </button>
        </div>
        <div class="feed-stats__current-refinements"></div>
        <div class="feed-stats__sort-and-filter-mobile">
           <div class="feed-stats__text-mobile">
               <h1 class="feed-stats__heading">Sort & Filter</h1>
               <button class="feed-stats__close-button" onclick="closeFilterSort()">&times;</button>
           </div>
           <div class="feed-stats__sort">
                @include('landings.feed.partials.accordian')
           </div>
        </div>
    </section>
    <section class="hits feed-grid">
    </section>
    <section class="feed-list">
        <div class="container feed-list__container">
            <div class="feed-list__table-holder">
                <table class="feed-list__table">
                    <thead class="feed-list__table-head">
                        <tr class="feed-list__table-row">
                            <th class="feed-list__table-cell feed-list__table-cell--card">Card</th>
                            <th class="feed-list__table-cell feed-list__table-cell--date">Date Graded</th>
                            <th class="feed-list__table-cell feed-list__table-cell--certificate">Certificate #</th>
                            <th class="feed-list__table-cell feed-list__table-cell--owner">Owner</th>
                            <th class="feed-list__table-cell feed-list__table-cell--grade">Grade</th>
                        </tr>
                    </thead>
                    <tbody class="feed-list__table-body list-hits ">
                    </tbody>
                </table>
            </div>
        </div>
    </section>
    <section class="feed-pagination-section">
        <div class="feed-pagination-section__items-per-page">
            <p class="hits-per-page">Items per page: &nbsp;</p>
        </div>
        <div class="feed-pagintion-section__pagination">
        </div>
    </section>
</x-layout>
