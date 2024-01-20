<x-layout>
    <x-slot name="head">
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tobiasroeder/imagebox@1.3.1/dist/imagebox.min.css">
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
    </x-slot>
    <x-slot name="body">
        <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script defer type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/tobiasroeder/imagebox@1.3.1/dist/imagebox.min.js"></script>
        <script defer>
            imagebox.options({
                info: false,
                swipeToChange: true,
                swipeToClose: true,
                closeEverywhere: true,
                keyControls: true,
            });

        </script>
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script>
        <script>
            (function() {
                var lightbox = GLightbox({
                    plyr: {
                        config: {
                            ratio: '9:16'
                        }
                    },
                    zoomable: false
                });

                AOS.init({
                    once: true,
                    easing: 'ease-in-out'
                });
            })();
        </script>
    </x-slot>
    <header class="authentication-view__header">
        <div class="authentication-view__header__overlay">
            <img class="authentication-view__header__overlay-background" src="{{ asset('assets/images/public-card-background.png') }}" alt="Wallpaper">
            <div class="authentication-view__header__overlay-color"></div>
        </div>

        <div class="container authentication-view__header__container authentication-view">
            <div class="authentication-view__card-holder"></div>
            <div class="authentication-view__header__content authentication-view__header__content">
                <div class="authentication-view__header__share">
                    <div class="authentication-view-view__share__icon-mobile" data-atom="card-page-share-modal" data-content="{{ url()->current() }}">
                        {{-- JS runtime actions --}}
                    </div>
                </div>
                <div class="authentication-view__header__details">
                    <p class="authentication-view__certificate">Certificate # {{ $certificate_number }}</p>
                </div>

                <div class="authentication-view__header__score">
                    <h1 class="authentication-view__subheading">{{ $long_name }}</h1>
                    <div class="authentication-view__certified-badge">
                        <p class="authentication-view__certified-label">Certified</p>
                        <p class="authentication-view__header__grade-score">
                        <div><span class="material-icons authentication-view__verified-user-icon">verified_user</span></div>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <section class="authentication-view__content">
        <div class="container authentication-view__content__container">
            <div class="authentication-view__content__card-holder">
                <div class="authentication-view__card authentication-view__card">
                    <div class="container" data-atom="card-image-slider" data-images="{{json_encode([$image_url])}}">
                    </div>
                </div>
            </div>
            <div class="authentication-view__details">
                <div class="authentication-view__details-col authentication-view__details-col--card">
                    <div class="authentication-view__left-side">
                        <div class="authentication-view__share">
                            <p class="authentication-view__share__title">SHARE</p>
                            <div class="authentication-view__share__icon" data-atom="card-page-share-box" data-content="{{ url()->current() }}">
                                {{-- JS runtime actions --}}
                            </div>
                        </div>
                        @if(false)
                            <div class="authentication-view__ags-population">
                                <div>
                                    <p class="authentication-view__ags-population__title">AGS POPULATION</p>
                                    <p class="authentication-view__ags-population__count">{{ $pop_data['totalPopForCurrentCard'] ?? 0 }}</p>
                                </div>
                            </div>
                        @endif
                    </div>
                    <div class="authentication-view__right-side authentication-view__right-side">
                        <div class="authentication-view__table-div-left authentication-view__table-div-left">
                            <table class="authentication-view__table">
                                <tbody>
                                <tr>
                                    <td class="authentication-view__table-cell authentication-view__table-cell--heading authentication-view__table-cell--heading">Certificate #:</td>
                                    <td class="authentication-view__table-cell">
                                        {{ $certificate_number }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="authentication-view__table-cell authentication-view__table-cell--heading authentication-view__table-cell--heading">Category:</td>
                                    <td class="authentication-view__table-cell">
                                        {{ $category }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="authentication-view__table-cell authentication-view__table-cell--heading authentication-view__table-cell--heading">Item Type:</td>
                                    <td class="authentication-view__table-cell">
                                        {{ $type }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="authentication-view__table-cell authentication-view__table-cell--heading authentication-view__table-cell--heading">Item:</td>
                                    <td class="authentication-view__table-cell">
                                        {{ $name }}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="authentication-view__table-div-right">
                            <table class="authentication-view__table authentication-view__table-div-right">
                                <tbody>
                                <tr>
                                    <td class="authentication-view__table-cell authentication-view__table-cell--heading authentication-view__table-cell--heading">Signed By:</td>
                                    <td class="authentication-view__table-cell">
                                        <span class="authentication-view-view__share__icon-mobile" data-atom="tooltip" data-content="{{ $signed_by }}">
                                            {{-- JS runtime actions --}}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="authentication-view__table-cell authentication-view__table-cell--heading authentication-view__table-cell--heading">Date Signed:</td>
                                    <td class="authentication-view__table-cell">
                                        {{ $signed_at }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="authentication-view__table-cell authentication-view__table-cell--heading authentication-view__table-cell--heading">Date Listed:</td>
                                    <td class="authentication-view__table-cell">
                                        {{ $created_at }}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="authentication-view__breakdown__scores-holder authentication-view__description-block">
                    <div class="authentication-view__breakdown__scores authentication-view__description-block__description">
                        This item was signed in the presence of a SpeedyComics representative and is guaranteed to be authentic by SpeedyComics/AGS Grading Authentication Services.
                    </div>
                    <a type="button" href="{{ route('authentication.index') }}" class="authentication-view__button">
                        Verify Another Certificate
                    </a>
            </div>
        </div>
        </div>
    </section>
    @include('landings.authentication.partials.related-items')
    @include('landings.authentication.partials.certificate-authenticity')
</x-layout>
