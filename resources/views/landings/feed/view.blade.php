<x-layout>
    <x-slot name="head">
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
        <link rel="stylesheet" type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"/>
        <link rel="stylesheet" type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tobiasroeder/imagebox@1.3.0/dist/imagebox.min.css">
    </x-slot>
    <x-slot name="body">
        <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script defer type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/tobiasroeder/imagebox@1.3.0/dist/imagebox.min.js"></script>

        <script defer>
            imagebox.options({
                info: false,
                swipeToChange: true,
                swipeToClose: true,
                closeEverywhere: true,
                keyControls: true,
            });

            $(function() {
                $('.feed-view__slider--js').slick({
                    infinite: true,
                    arrows: true,
                    dots: false,
                    speed: 300,
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    responsive: [
                        {
                            breakpoint: 960,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3,
                            },
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2,
                            },
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                            },
                        },
                    ],
                });
            })
        </script>
    </x-slot>
    @if($grades_available)
        <header class="feed-view__header">
            <div class="feed-view__header__overlay">
                <img class="feed-view__header__overlay-background" src="{{ asset('assets/images/pokemon-wallpaper.jpeg') }}"
                     alt="Wallpaper">
                <div class="feed-view__header__overlay-color"></div>
            </div>

            <div class="container feed-view__header__container">
                <div class="feed-view__card-holder"></div>
                <div class="feed-view__header__content">
                    <div class="feed-view__header__details">
                        <p class="feed-view__header__certificate">Certificate #{{ $certificate_id }}</p>
                        <h1 class="feed-view__header__heading">{{ $card['name'] }}</h1>
                        <h1 class="feed-view__header__subheading">{{ $card['full_name'] }}</h1>
                    </div>
                    <div class="feed-view__header__score">
                        <div class="feed-view__header__grade">
                            <p class="feed-view__header__grade-label">{{ $grade['nickname'] }}</p>
                            <p class="feed-view__header__grade-score">{{ $grade['grade'] }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <section class="feed-view__content">
            <div class="container feed-view__content__container">
                <div class="feed-view__card-holder">
                    <div class="feed-view__card">
                        <img class="feed-view__card-image" src="{{ $card['image_path'] }}"
                             alt="{{ $card['name'] }}">
                    </div>
                </div>
                <div class="feed-view__details">
                    <div class="feed-view__details-col feed-view__details-col--card">
                        <table class="feed-view__table">
                            <tbody>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Card Type</td>
                                    <td class="feed-view__table-cell">
                                        {{ $card['type'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Series</td>
                                    <td class="feed-view__table-cell">
                                        {{ $card['series'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Set</td>
                                    <td class="feed-view__table-cell">
                                        {{ $card['set'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Release Date</td>
                                    <td class="feed-view__table-cell">
                                        {{ $card['release_date'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Card</td>
                                    <td class="feed-view__table-cell">
                                        {{ $card['number'] }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
    {{--                <div class="feed-view__details-col feed-view__details-col--owner">--}}
    {{--                    <table class="feed-view__table">--}}
    {{--                        <tbody>--}}
    {{--                            <tr>--}}
    {{--                                <td class="feed-view__table-cell feed-view__table-cell--heading">Owner</td>--}}
    {{--                                <td class="feed-view__table-cell">--}}
    {{--                                    JimBean20--}}
    {{--                                </td>--}}
    {{--                            </tr>--}}
    {{--                            <tr>--}}
    {{--                                <td class="feed-view__table-cell feed-view__table-cell--heading">&nbsp;</td>--}}
    {{--                                <td class="feed-view__table-cell">--}}
    {{--                                    <a class="feed-view__table__request-details" href="#">Request Contact--}}
    {{--                                        Details</a>--}}
    {{--                                </td>--}}
    {{--                            </tr>--}}
    {{--                        </tbody>--}}
    {{--                    </table>--}}
    {{--                </div>--}}
                </div>
            </div>
        </section>

        <section class="feed-view__breakdown feed-view__breakdown--overall">
            <div class="container feed-view__breakdown__container">
                <div class="feed-view__breakdown__score-holder">
                    <div class="feed-view__breakdown__score feed-view__breakdown__score--contained">
                        <div class="feed-view__breakdown__scores-score feed-view__breakdown__scores-score--full">
                            <p class="feed-view__breakdown__label feed-view__breakdown__label--magnify">Overall Grade</p>
                            <p class="feed-view__breakdown__value feed-view__breakdown__value--magnify">{{ $grade['grade'] }} <small
                                    class="feed-view__breakdown__value-label">{{ $grade['nickname'] }}</small></p>
                        </div>
                    </div>
                </div>

                <div class="feed-view__breakdown__scores-holder">
                    <div class="feed-view__breakdown__scores feed-view__breakdown__scores--contained">
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Centering
                                <br/>
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">{{ $overall['centering'] }}</p>
                        </div>
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Surface
                                <br/>
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">{{ $overall['surface'] }}</p>
                        </div>
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Edges
                                <br/>
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">{{ $overall['edges'] }}</p>
                        </div>
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Corners
                                <br/>
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">{{ $overall['corners'] }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="feed-view__breakdown feed-view__breakdown--front">
            <div class="container">
                <h4 class="feed-view__breakdown__heading">Front of Card Breakdown</h4>
                <div class="feed-view__breakdown__scores">
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">Centering (Front)</p>
                        <p class="feed-view__breakdown__value">{{ $front_scan['centering'] }}</p>
                    </div>
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">Surface (Front)</p>
                        <p class="feed-view__breakdown__value">{{ $front_scan['surface'] }}</p>
                    </div>
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">Edges (Front)</p>
                        <p class="feed-view__breakdown__value">{{ $front_scan['edges'] }}</p>
                    </div>
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">Corners (Front)</p>
                        <p class="feed-view__breakdown__value">{{ $front_scan['corners'] }}</p>
                    </div>
                </div>
            </div>
        </section>

        <div class="container">
            <hr class="divider"/>
        </div>

        <section class="feed-view__breakdown feed-view__breakdown--back">
            <div class="container">
                <h4 class="feed-view__breakdown__heading">Back of Card Breakdown</h4>
                <div class="feed-view__breakdown__scores">
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">Centering (Back)</p>
                        <p class="feed-view__breakdown__value">{{ $back_scan['centering'] }}</p>
                    </div>
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">Surface (Back)</p>
                        <p class="feed-view__breakdown__value">{{ $back_scan['surface'] }}</p>
                    </div>
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">Edges (Back)</p>
                        <p class="feed-view__breakdown__value">{{ $back_scan['edges'] }}</p>
                    </div>
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">Corners (Back)</p>
                        <p class="feed-view__breakdown__value">{{ $back_scan['corners'] }}</p>
                    </div>
                </div>
            </div>
        </section>

        <div class="container">
            <hr class="divider"/>
        </div>
        @if($generated_images)
        <section class="feed-view__images">
            <div class="container">
                <h4 class="feed-view__images__heading">Generated Images</h4>
                <div class="feed-view__slider feed-view__slider--js">
                    @foreach($generated_images as $generated_image)
                        <div class="feed-view__slider__item">
                            <img class="feed-view__slider__image"
                                src="{{ $generated_image['output_image'] }}" alt="{{ $generated_image['name'] }}" 
                                data-imagebox="gallery"
                                data-imagebox-caption="{{ $generated_image['name'] }}"
                            >
                            <p class="feed-view__slider__caption">{{ $generated_image['name'] }}</p>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
        @endif
    @else
        Grades are not available yet.
    @endif
</x-layout>
