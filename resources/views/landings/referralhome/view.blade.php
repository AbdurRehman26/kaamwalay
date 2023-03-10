<x-layout>
    <x-slot name="head">
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tobiasroeder/imagebox@1.3.0/dist/imagebox.min.css">
    </x-slot>
    @include('landings.referralhome.signup')
    @include('landings.referralhome.about')
    @include('landings.referralhome.steps')
    @include('landings.referralhome.community')
    @include('landings.referralhome.conclusion')
    <x-slot name="body">
        <style>
            .ib-image {
                transform: translate(-50%, -50%) rotate(0deg) !important;
            }
        </style>
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script>
        <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/tobiasroeder/imagebox@1.3.0/dist/imagebox.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
        <script>
            (function() {
                AOS.init({
                    once: true,
                    easing: 'ease-in-out'
                });
            })();

            const myGallery = GLightbox({
                elements: [{
                    'href': "{{ asset('assets/images/landings/referralhome/home.mp4') }}",
                    'type': 'video',
                    'source': 'assets'
                }, ]
            });

            function playVideo() {
                myGallery.open();
            }
        </script>
    </x-slot>
</x-layout>