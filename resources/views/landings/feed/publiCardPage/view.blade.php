<x-layout>
    <x-slot name="head">
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tobiasroeder/imagebox@1.3.0/dist/imagebox.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css" />
    </x-slot>
    <x-slot name="body">
        <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script defer type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/tobiasroeder/imagebox@1.3.0/dist/imagebox.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

        <script defer>
            var swiper = new Swiper(".mySwiper", {
                loop: false,
                spaceBetween: 10,
                slidesPerView: 4,
                freeMode: true,
                watchSlidesProgress: true
            });
            var swiper2 = new Swiper(".mySwiper2", {
                loop: false,
                spaceBetween: 10,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                thumbs: {
                    swiper: swiper
                }
            });
            imagebox.options({
                info: false,
                swipeToChange: true,
                swipeToClose: true,
                closeEverywhere: true,
                keyControls: true,
            });

            $(function() {
                $('.feed-view__slider--js').slick({
                    infinite: false,
                    arrows: true,
                    dots: false,
                    speed: 300,
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    responsive: [{
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

            var options = {
                series: [{
                    data: [8, 200, 400, 600, 22, 200, 400, 600, 45, 200, 421, 600, 5, 200, 400, 600, 55, 200, 400]
                }],
                chart: {
                    height: 350,
                    padding: 10,
                    type: 'bar',
                    toolbar: {
                        show: false,
                    }
                },
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: false,
                        borderRadius: 8,
                    },
                },
                colors: [
                    "#6C31BC"
                ],
                title: {
                    text: 'AGS Population',
                },
                fill: {
                    type: 'solid'
                },
                dataLabels: {
                    enabled: false,
                },
                legend: {
                    show: false
                },
                xaxis: {
                    categories: [
                        ['PR', '1'],
                        ['FR', '1.5'],
                        ['GOOD', '2'],
                        ['GOOD+', '2.5'],
                        ['VG', '3'],
                        ['VG+', '3'],
                        ['VG-EX', '4'],
                        ['VG-EX+', '4.5'],
                        ['EX', '5'],
                        ['EX+', '5.5'],
                        ['EX-MT', '6'],
                        ['EX-MT+', '6.5'],
                        ['NM', '7'],
                        ['NM+', '7.5'],
                        ['NM-MT', '8'],
                        ['NM-MT+', '8.5'],
                        ['MINT', '9'],
                        ['MINT+', '9.5'],
                        ['GEM-MT', '10'],

                    ],
                    labels: {
                        style: {
                            fontSize: '12px'
                        }
                    },
                }
            };

            var chart = new ApexCharts(document.querySelector(".feed-view__graph__content"), options);
            chart.render();
        </script>
    </x-slot>
    <header class="feed-view__header">
        <div class="feed-view__header__overlay">
            <img class="feed-view__header__overlay-background" src="{{ asset('assets/images/public-card-background.png') }}" alt="Wallpaper">
            <div class="feed-view__header__overlay-color"></div>
        </div>

        <div class="container feed-view__header__container">
            <div class="feed-view__card-holder"></div>
            <div class="feed-view__header__content">
                <div class="feed-view__header__details">
                    <p class="feed-view__header__certificate">Certificate #00000750</p>
                    <h1 class="feed-view__header__heading">Weepinbell</h1>
                    <h1 class="feed-view__header__subheading">2021 Pokemon SWSH Shining Fates FA/Charizard VMAX </h1>
                </div>
                <div class="feed-view__header__score">
                    <div class="feed-view__header__grade">
                        <p class="feed-view__header__grade-label">NM+</p>
                        <p class="feed-view__header__grade-score">7.5</p>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <section class="feed-view__content">
        <div class="container feed-view__content__container">
            <div class="feed-view__card-holder">
                <div class="feed-view__card">
                    @include('landings.feed.publiCardPage.cardsImageSlider')
                </div>
            </div>
            <div class="feed-view__details">
                <div class="feed-view__details-col feed-view__details-col--card">
                    <div class="feed-view__left-side">
                        <div class="feed-view__share">
                            <p class="feed-view__share__title">SHARE</p>
                            <button class="material-icons">content_copy_rounded</button>
                        </div>
                        <table class="feed-view__table">
                            <tbody>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Card Type:</td>
                                    <td class="feed-view__table-cell">
                                        Pokemon
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Series:</td>
                                    <td class="feed-view__table-cell">
                                        Sword & Shield Series
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Set:</td>
                                    <td class="feed-view__table-cell">
                                        Battle Styles
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="feed-view__right-side">
                        <div class="feed-view__ags-population">
                            <div>
                                <p class="feed-view__ags-population__title">AGS POPULATION</p>
                                <p class="feed-view__ags-population__count">20</p>
                            </div>
                            <div class="feed-view__ags-population__icon">
                                <div><span class="material-icons">analytics</span></div>
                                <div>
                                    <p class="feed-view__ags-population__icon__text">View Chart</p>
                                </div>
                            </div>
                        </div>
                        <table class="feed-view__table">
                            <tbody>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Release Date:</td>
                                    <td class="feed-view__table-cell">
                                        March 19, 2021
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Card:</td>
                                    <td class="feed-view__table-cell">
                                        #SV107
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Owner:</td>
                                    <td class="feed-view__table-cell">
                                        pokepoke231
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="feed-view__breakdown__scores-holder">
                    <div class="feed-view__breakdown__scores feed-view__breakdown__scores--contained">
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Centering
                                <br />
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">9.5</p>
                        </div>
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Surface
                                <br />
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">9.5</p>
                        </div>
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Edges
                                <br />
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">9.5</p>
                        </div>
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Corners
                                <br />
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">9.5</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    @include('landings.feed.publiCardPage.grades')
    @include('landings.feed.publiCardPage.populationGraph')
    @include('landings.feed.publiCardPage.generatedImages')
</x-layout>