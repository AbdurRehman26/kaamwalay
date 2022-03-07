<x-layout pageClass="page--home">
    <x-slot name="head">
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css"
              href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />
        <link rel="stylesheet" type="text/css"
              href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
    </x-slot>
    <x-slot name="header">
        @include('landings.home.hero')
    </x-slot>
    @include('landings.home.about')
    @include('landings.home.availableCards')
    @include('landings.home.pricing')
    @include('landings.home.details')
    @include('landings.home.features')
    @include('landings.home.testimonial')
    @include('landings.home.conclusion')
    <x-slot name="body">
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script>
            (function() {
                AOS.init();
            })();
        </script>

        <script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script>
        <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script type="text/javascript"
                src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
        <script>
            $(function() {
                var lightbox = GLightbox();

                $('.Home-prices--js').slick({
                    arrows: true,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    responsive: [
                        {
                            breakpoint: 1280,
                            settings: {
                                slidesToShow: 3,
                            },
                        },
                        {
                            breakpoint: 1000,
                            settings: {
                                slidesToShow: 2,
                            },
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 1,
                            },
                        },
                    ],
                });
            });
        </script>
    </x-slot>
</x-layout>
