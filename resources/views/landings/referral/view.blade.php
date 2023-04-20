<x-layout pageClass="page--referral">
    <x-slot name="head">
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
    </x-slot>
    <x-slot name="header">
        @include('landings.referral.hero')
        @include('landings.referral.content')
        @include('landings.referral.instructions')
        @include ('landings.referral.marketing-content')
        @include ('landings.referral.partner-program')
        @include ('landings.referral.bonus-earnings')
    </x-slot>
    <x-slot name="body">
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script>
        <script>
            (function() {
                var lightbox = GLightbox({
                    plyr: {
                        config: {
                            ratio: '9:16'   
                        }
                    }
                });

                AOS.init({
                    once: true,
                    easing: 'ease-in-out'
                });
            })();
        </script>
    </x-slot>
</x-layout>
