<x-layout>
    <section
        class="pop-index-hero p-5 text-center bg-image rounded-3"
    >
        <div class="container-fluid align-middle pop-index-hero__container">
            <div class="pop-index-hero__mask">
                <div class="d-flex justify-content-center align-items-center h-100 text-white">
                    <h1 class="pop-index-hero__title mb-3">Population Report</h1>
                    <h4 class="pop-index-hero__subhead mb-3">A record of all cards Robograded by AGS. </h4>
                    <h4 class="pop-index-hero__subhead mb-3">Select a category below.</h4>
                </div>
            </div>
        </div>
    </section>
    <section class="categories-list">
        <div class="container">
            <div class="row">
                @foreach($categories as $category)
                    <a class="clash-card barbarian">
                        <div class="clash-card__image clash-card__image--barbarian">
                            <img src="{{$category->image_url}}" alt="{{$category->name}}" class="category-logo"/>
                        </div>
                        <div class="clash-card__unit-stats clash-card__unit-stats--barbarian clearfix">
                            <div class="one-third">
                                <div class="stat">{{ formatNumbers($category->card_sets_count) }}</div>
                                <div class="stat-value">Sets</div>
                            </div>

                            <div class="one-third">
                                <div class="stat">{{ formatNumbers($category->card_products_count) }}</div>
                                <div class="stat-value">Cards</div>
                            </div>

                            <div class="one-third no-border">
                                <div class="stat">{{ formatNumbers($category->card_products_sum_population) }}</div>
                                <div class="stat-value">Graded</div>
                            </div>
                        </div>
                    </a> <!-- end clash-card barbarian-->
                @endforeach
                @if(count($categories) % 4)
                    <div class="category-box category-box-fade display-lg">
                        @include('landings.pop.partials.categories-coming-soon')
                    </div>
                    @for($i = 0; $i < (4 - count($categories) % 4) - 1 ; $i++)
                        <div class="category-box category-box-fade display-lg">
                        </div>
                    @endfor
                @endif
                @if(count($categories) % 3)
                    <div class="category-box category-box-fade display-md">
                        @include('landings.pop.partials.categories-coming-soon')
                    </div>
                    @for($i = 0; $i < (3 - count($categories) % 3) - 1 ; $i++)
                        <div class="category-box category-box-fade display-md">
                        </div>
                    @endfor
                @endif
                @if(count($categories) % 2)
                    <div class="category-box category-box-fade display-mobile">
                        @include('landings.pop.partials.categories-coming-soon')
                    </div>
                @endif
            </div>

            @if(!(count($categories) % 4))
                <div class="row coming-soon-row display-lg">
                    @for($i = 0; $i < 4; $i++)
                        <div class="category-box category-box-fade">
                        </div>
                    @endfor
                    @include('landings.pop.partials.categories-coming-soon')
                </div>
            @endif
            @if(!(count($categories) % 3))
                <div class="row coming-soon-row display-md">
                    @for($i = 0; $i < 3; $i++)
                        <div class="category-box category-box-fade">
                        </div>
                    @endfor
                    @include('landings.pop.partials.categories-coming-soon')
                </div>
            @endif
            @if(!(count($categories) % 2))
                <div class="row coming-soon-row display-mobile">
                    @for($i = 0; $i < 2; $i++)
                        <div class="category-box category-box-fade">
                        </div>
                    @endfor
                    @include('landings.pop.partials.categories-coming-soon')
                </div>
            @endif
        </div>

    </section>
</x-layout>
