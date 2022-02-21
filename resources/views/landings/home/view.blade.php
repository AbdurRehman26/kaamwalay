<x-layout pageClass="page--home">
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
</x-layout>
