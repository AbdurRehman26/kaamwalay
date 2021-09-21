<header class="page__header">
    <div class="page__header__drawer atoms--drawer-navigation">
        {{-- JS runtime actions --}}
    </div>

    <div class="page__header__brand-holder">
        <a href="{{ url('/') }}" class="page__header__brand">
            <img class="page__header__brand-image" src="{{ asset('assets/images/robograding-logo.svg') }}" alt="Robograding"/>
        </a>
    </div>

    <!--
    <div class="page__header__nav-holder">
        <nav class="page__header__nav">
            <a href="{{ url('/feed') }}" class="page__header__nav-item page__header__nav-item--active">Feed</a>
            <a href="{{ url('/how-it-works') }}" class="page__header__nav-item">How It Works</a>
            <a href="{{ url('/pricing') }}" class="page__header__nav-item">Pricing</a>
            <a href="{{ url('/about-us') }}" class="page__header__nav-item">About Us</a>
            <a href="{{ url('/faq') }}" class="page__header__nav-item">FAQ</a>
        </nav>
    </div> -->

    <div class="page__header__auth atoms--auth-controls">
        {{-- JS runtime actions --}}
    </div>
</header>

{{ $slot }}
