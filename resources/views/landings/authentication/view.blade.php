<x-layout>
    <x-slot name="head">
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tobiasroeder/imagebox@1.3.1/dist/imagebox.min.css">
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
    </x-slot>
    <header class="feed-view__header">
        <div class="feed-view__header__overlay">
            <img class="feed-view__header__overlay-background" src="{{ asset('assets/images/public-card-background.png') }}" alt="Wallpaper">
            <div class="feed-view__header__overlay-color"></div>
        </div>

        <div class="container feed-view__header__container authentication-view">
            <div class="feed-view__card-holder"></div>
            <div class="feed-view__header__content authentication-view__header__content">
                <div class="authentication-view__header__share">
                    <div class="authentication-view-view__share__icon-mobile" data-atom="card-page-share-modal" data-content="{{ url()->current() }}">
                        {{-- JS runtime actions --}}
                    </div>
                </div>
                <div class="feed-view__header__details">
                    <p class="authentication-view__certificate">Certificate # {{ $certificate_number }}</p>
                </div>

                <div class="feed-view__header__score">
                    <h1 class="authentication-view__subheading">{{ $long_name }}</h1>
                    <div class="authentication-view__certified-badge">
                        <p class="authentication-view__certified-label">Certified</p>
                        <p class="feed-view__header__grade-score">
                        <div><span class="material-icons authentication-view__verified-user-icon">verified_user</span></div>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <section class="feed-view__content">
        <div class="container feed-view__content__container">
            <div class="feed-view__content__card-holder">
                <div class="authentication-view__card feed-view__card">
                    <div class="container" data-atom="card-image-slider" data-images="{{json_encode([$image_url])}}">
                    </div>
                </div>
            </div>
            <div class="feed-view__details">
                <div class="feed-view__details-col feed-view__details-col--card">
                    <div class="feed-view__left-side">
                        <div class="feed-view__share">
                            <p class="feed-view__share__title">SHARE</p>
                            <div class="feed-view__share__icon" data-atom="card-page-share-box" data-content="{{ url()->current() }}">
                                {{-- JS runtime actions --}}
                            </div>
                        </div>
                        @if(false)
                            <div class="feed-view__ags-population">
                                <div>
                                    <p class="feed-view__ags-population__title">AGS POPULATION</p>
                                    <p class="feed-view__ags-population__count">{{ $pop_data['totalPopForCurrentCard'] ?? 0 }}</p>
                                </div>
                            </div>
                        @endif
                    </div>
                    <div class="feed-view__right-side authentication-view__right-side">
                        <div class="feed-view__table-div-left authentication-view__table-div-left">
                            <table class="feed-view__table">
                                <tbody>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading authentication-view__table-cell--heading">Certificate #:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $certificate_number }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading authentication-view__table-cell--heading">Category:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $category }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading authentication-view__table-cell--heading">Item Type:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $type }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading authentication-view__table-cell--heading">Item:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $name }}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="feed-view__table-div-right">
                            <table class="feed-view__table authentication-view__table-div-right">
                                <tbody>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading authentication-view__table-cell--heading">Signed By:</td>
                                    <td class="feed-view__table-cell">
                                        {{ Str::of($signed_by)->explode(',')->first() }}
                                        <Tooltip title="12312">
                                            <Button>top-start</Button>
                                        </Tooltip>

                                        <Tooltip title="Add" arrow>
                                            <Button>Arrow</Button>
                                        </Tooltip>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading authentication-view__table-cell--heading">Date Signed:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $signed_at }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="feed-view__table-cell feed-view__table-cell--heading authentication-view__table-cell--heading">Date Listed:</td>
                                    <td class="feed-view__table-cell">
                                        {{ $created_at }}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="feed-view__breakdown__scores-holder authentication-view__description-block">
                    <div class="feed-view__breakdown__scores authentication-view__description-block__description">
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
