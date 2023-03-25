<x-layout pageClass="page--partner">
    <x-slot name="head">
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
    </x-slot>
    <x-slot name="header">
        @include('landings.partners.hero')
        @include('landings.partners.content')
        @include('landings.partners.instructions')
        @include ('landings.partners.marketing-content')
        @include ('landings.partners.partner-program')
        @include ('landings.partners.bonus-earnings')
    </x-slot>
    <x-slot name="body">
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script>
        <script>
            (function() {
                var lightbox = GLightbox();

                AOS.init({
                    once: true,
                    easing: 'ease-in-out'
                });
            })();
        </script>
    </x-slot>
</x-layout>
