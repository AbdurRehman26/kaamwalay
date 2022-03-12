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
                '{{ config("scout.algolia.public") }}'
            );

            const search = instantsearch({
                indexName: '{{ config("scout.prefix") }}user_cards',
                searchClient,
            });

        </script>
            @include('landings.feed.partials.scripts.current-refinement')
            @include('landings.feed.partials.scripts.mobile-view')
    </x-slot>
    <section data-atom="feed">
        {{-- JS runtime actions --}}
    </section>
  
    <section class="feed-stats">
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
</x-layout>
