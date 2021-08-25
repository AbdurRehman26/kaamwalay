<x-layout>
    <x-slot name="head">
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
        <link rel="stylesheet" type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"/>
        <link rel="stylesheet" type="text/css"
              href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"/>
    </x-slot>
    <x-slot name="body">
        <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script type="text/javascript"
                src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js"></script>
        <script defer>
            $(function () {
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
                            }
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        },
                    ],
                });
            });
        </script>
    </x-slot>
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
                    <p class="feed-view__header__certificate">Certificate #90973737</p>
                    <h1 class="feed-view__header__heading">Charizard</h1>
                    <h1 class="feed-view__header__subheading">2020 Pokemon Sword & Shield Vivid Voltage 025
                        Charizard</h1>
                </div>
                <div class="feed-view__header__score">
                    <div class="feed-view__header__grade">
                        <p class="feed-view__header__grade-label">Mint</p>
                        <p class="feed-view__header__grade-score">9.5</p>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <section class="feed-view__content">
        <div class="container feed-view__content__container">
            <div class="feed-view__card-holder">
                <div class="feed-view__card">
                    <img class="feed-view__card-image" src="{{ asset('assets/images/charizard-image.png') }}"
                         alt="Charizard">
                </div>
            </div>
            <div class="feed-view__details">
                <div class="feed-view__details-col feed-view__details-col--card">
                    <table class="feed-view__table">
                        <tbody>
                            <tr>
                                <td class="feed-view__table-cell feed-view__table-cell--heading">Card Type</td>
                                <td class="feed-view__table-cell">
                                    Pokemon
                                </td>
                            </tr>
                            <tr>
                                <td class="feed-view__table-cell feed-view__table-cell--heading">Series</td>
                                <td class="feed-view__table-cell">
                                    Sword & Shield
                                </td>
                            </tr>
                            <tr>
                                <td class="feed-view__table-cell feed-view__table-cell--heading">Set</td>
                                <td class="feed-view__table-cell">
                                    Vivid Voyage
                                </td>
                            </tr>
                            <tr>
                                <td class="feed-view__table-cell feed-view__table-cell--heading">Release Date</td>
                                <td class="feed-view__table-cell">
                                    August 23, 2020
                                </td>
                            </tr>
                            <tr>
                                <td class="feed-view__table-cell feed-view__table-cell--heading">Card</td>
                                <td class="feed-view__table-cell">
                                    025
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="feed-view__details-col feed-view__details-col--owner">
                    <table class="feed-view__table">
                        <tbody>
                            <tr>
                                <td class="feed-view__table-cell feed-view__table-cell--heading">Owner</td>
                                <td class="feed-view__table-cell">
                                    JimBean20
                                </td>
                            </tr>
                            <tr>
                                <td class="feed-view__table-cell feed-view__table-cell--heading">&nbsp;</td>
                                <td class="feed-view__table-cell">
                                    <a class="feed-view__table__request-details" href="#">Request Contact
                                        Details</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    <section class="feed-view__breakdown feed-view__breakdown--overall">
        <div class="container feed-view__breakdown__container">
            <div class="feed-view__breakdown__score-holder">
                <div class="feed-view__breakdown__score feed-view__breakdown__score--contained">
                    <div class="feed-view__breakdown__scores-score feed-view__breakdown__scores-score--full">
                        <p class="feed-view__breakdown__label feed-view__breakdown__label--magnify">Overall Grade</p>
                        <p class="feed-view__breakdown__value feed-view__breakdown__value--magnify">9.5 <small
                                class="feed-view__breakdown__value-label">Mint</small></p>
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
                        <p class="feed-view__breakdown__value">10</p>
                    </div>
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">
                            Surface
                            <br/>
                            (Overall)
                        </p>
                        <p class="feed-view__breakdown__value">9</p>
                    </div>
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">
                            Edges
                            <br/>
                            (Overall)
                        </p>
                        <p class="feed-view__breakdown__value">10</p>
                    </div>
                    <div class="feed-view__breakdown__scores-score">
                        <p class="feed-view__breakdown__label">
                            Corners
                            <br/>
                            (Overall)
                        </p>
                        <p class="feed-view__breakdown__value">9</p>
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
                    <p class="feed-view__breakdown__value">10</p>
                </div>
                <div class="feed-view__breakdown__scores-score">
                    <p class="feed-view__breakdown__label">Surface (Front)</p>
                    <p class="feed-view__breakdown__value">9</p>
                </div>
                <div class="feed-view__breakdown__scores-score">
                    <p class="feed-view__breakdown__label">Edges (Front)</p>
                    <p class="feed-view__breakdown__value">10</p>
                </div>
                <div class="feed-view__breakdown__scores-score">
                    <p class="feed-view__breakdown__label">Corners (Front)</p>
                    <p class="feed-view__breakdown__value">9</p>
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
                    <p class="feed-view__breakdown__value">10</p>
                </div>
                <div class="feed-view__breakdown__scores-score">
                    <p class="feed-view__breakdown__label">Surface (Back)</p>
                    <p class="feed-view__breakdown__value">9</p>
                </div>
                <div class="feed-view__breakdown__scores-score">
                    <p class="feed-view__breakdown__label">Edges (Back)</p>
                    <p class="feed-view__breakdown__value">10</p>
                </div>
                <div class="feed-view__breakdown__scores-score">
                    <p class="feed-view__breakdown__label">Corners (Back)</p>
                    <p class="feed-view__breakdown__value">9</p>
                </div>
            </div>
        </div>
    </section>

    <div class="container">
        <hr class="divider"/>
    </div>

    <section class="feed-view__images">
        <div class="container">
            <h4 class="feed-view__images__heading">Generated Images</h4>
            <div class="feed-view__slider feed-view__slider--js">
                <div class="feed-view__slider__item">
                    <a href="#" class="feed-view__slider__link">
                        <img class="feed-view__slider__image"
                             src="{{ asset('assets/images/previews/centering-front.png') }}" alt="Front Centering">
                        <p class="feed-view__slider__caption">Front Centering</p>
                    </a>
                </div>
                <div class="feed-view__slider__item">
                    <a href="#" class="feed-view__slider__link">
                        <img class="feed-view__slider__image"
                             src="{{ asset('assets/images/previews/surface-front.png') }}" alt="Front Surface">
                        <p class="feed-view__slider__caption">Front Surface</p>
                    </a>
                </div>
                <div class="feed-view__slider__item">
                    <a href="#" class="feed-view__slider__link">
                        <img class="feed-view__slider__image"
                             src="{{ asset('assets/images/previews/edges-front.png') }}" alt="Front Edges">
                        <p class="feed-view__slider__caption">Front Edges</p>
                    </a>
                </div>
                <div class="feed-view__slider__item">
                    <a href="#" class="feed-view__slider__link">
                        <img class="feed-view__slider__image"
                             src="{{ asset('assets/images/previews/corners-front.png') }}" alt="Front Corners">
                        <p class="feed-view__slider__caption">Front Corners</p>
                    </a>
                </div>
                <div class="feed-view__slider__item">
                    <a href="#" class="feed-view__slider__link">
                        <img class="feed-view__slider__image"
                             src="{{ asset('assets/images/previews/centering-back.png') }}" alt="Back Centering">
                        <p class="feed-view__slider__caption">Back Centering</p>
                    </a>
                </div>
            </div>
        </div>
    </section>
</x-layout>
