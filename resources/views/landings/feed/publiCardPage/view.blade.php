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
            const front = document.getElementsByClassName("feed-view__images__cards-front");
            const back = document.getElementsByClassName("feed-view__images__cards-back");
            const frontButton = document.getElementsByClassName("feed-view__generated-images__buttons__front");
            const backButton = document.getElementsByClassName("feed-view__generated-images__buttons__back");

            function frontButtonToggle() {
                front[0].style.display = "flex";
                frontButton[0].style.background = "rgba(32, 191, 184, 0.08)"
                frontButton[0].style.border = "1px solid #20bfb8";
                frontButton[0].style.color = "#20bfb8";
                backButton[0].style.background = "#FFFFFF"
                backButton[0].style.border = "1px solid rgba(0, 0, 0, 0.18)";
                backButton[0].style.color = "rgba(0, 0, 0, 0.54)";
                back[0].style.display = "none";
            }

            function backButtonToggle() {
                back[0].style.display = "flex";
                backButton[0].style.background = "rgba(32, 191, 184, 0.08)"
                backButton[0].style.border = "1px solid #20bfb8";
                backButton[0].style.color = "#20bfb8";
                frontButton[0].style.background = "#FFFFFF"
                frontButton[0].style.border = "1px solid rgba(0, 0, 0, 0.18)";
                frontButton[0].style.color = "rgba(0, 0, 0, 0.54)";
                front[0].style.display = "none";
            }

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

            var options = {
                series: [{
                    name: '',
                    data: [
                        JSON.parse("{{ $graphPopData['PR'] }}"),
                        JSON.parse("{{ $graphPopData['FR'] }}"),
                        JSON.parse("{{ $graphPopData['GOOD'] }}"),
                        JSON.parse("{{ $graphPopData['GOOD+'] }}"),
                        JSON.parse("{{ $graphPopData['VG'] }}"),
                        JSON.parse("{{ $graphPopData['VG+'] }}"),
                        JSON.parse("{{ $graphPopData['VG-EX'] }}"),
                        JSON.parse("{{ $graphPopData['VG-EX+'] }}"),
                        JSON.parse("{{ $graphPopData['EX'] }}"),
                        JSON.parse("{{ $graphPopData['EX+'] }}"),
                        JSON.parse("{{ $graphPopData['EX-MT'] }}"),
                        JSON.parse("{{ $graphPopData['EX-MT+'] }}"),
                        JSON.parse("{{ $graphPopData['NM'] }}"),
                        JSON.parse("{{ $graphPopData['NM+'] }}"),
                        JSON.parse("{{ $graphPopData['NM-MT'] }}"),
                        JSON.parse("{{ $graphPopData['NM-MT+'] }}"),
                        JSON.parse("{{ $graphPopData['MINT'] }}"),
                        JSON.parse("{{ $graphPopData['MINT+'] }}"),
                        JSON.parse("{{ $graphPopData['GEM-MT'] }}"),
                    ]
                }],
                chart: {
                    height: '450px',
                    width: '100%',
                    padding: '20px',
                    background: '#F4F4FB',
                    borderRadius: '8px',
                    type: 'bar',
                    toolbar: {
                        show: false,
                    }
                },
                plotOptions: {
                    bar: {
                        columnWidth: 70,
                        distributed: false,
                        borderRadius: 8,
                    },
                },
                colors: [
                    "#6C31BC"
                ],
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

            $(".feed-view__ags-population__icon").click(function() {
                $('html,body').animate({
                        scrollTop: $(".feed-view__graph").offset().top
                    },
                    'slow');
            });
        </script>
    </x-slot>
    @if($grades_available)
    <header class="feed-view__header">
        <div class="feed-view__header__overlay">
            <img class="feed-view__header__overlay-background" src="{{ asset('assets/images/public-card-background.png') }}" alt="Wallpaper">
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
            <div class="feed-view__content__card-holder">
                <div class="feed-view__card">
                    @include('landings.feed.publiCardPage.cardsImageSlider')
                </div>
            </div>
            <div class="feed-view__details">
                <div class="feed-view__details-col feed-view__details-col--card">
                    <div class="feed-view__left-side">
                        <div class="feed-view__share">
                            <p class="feed-view__share__title">SHARE</p>
                            <div class="feed-view__share__icon" data-atom="copy-to-clip-board" data-content="Start a submission">
                                {{-- JS runtime actions --}}
                            </div>
                        </div>
                        <table class="feed-view__table">
                            <tbody>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Card Type:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $card['type'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Series:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $card['series'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Set:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $card['set'] }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="feed-view__right-side">
                        <div class="feed-view__ags-population">
                            <div>
                                <p class="feed-view__ags-population__title">AGS POPULATION</p>
                                <p class="feed-view__ags-population__count">{{ $totalAgsPopulation }}</p>
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
                                        {{ $card['release_date'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Card:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $card['number'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading">Owner:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $owner }}
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
                            <p class="feed-view__breakdown__value">{{ $overall['centering'] }}</p>
                        </div>
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Surface
                                <br />
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">{{ $overall['surface'] }}</p>
                        </div>
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Edges
                                <br />
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">{{ $overall['edges'] }}</p>
                        </div>
                        <div class="feed-view__breakdown__scores-score">
                            <p class="feed-view__breakdown__label">
                                Corners
                                <br />
                                (Overall)
                            </p>
                            <p class="feed-view__breakdown__value">{{ $overall['corners'] }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    @include('landings.feed.publiCardPage.grades')
    @include('landings.feed.publiCardPage.populationGraph')
    @include('landings.feed.publiCardPage.generatedImages')
    @include('landings.feed.publiCardPage.conclusion')
    @else
    Grades are not available yet.
    @endif
</x-layout>
