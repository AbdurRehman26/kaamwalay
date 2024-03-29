<footer class="Footer-root">
    <div class="container Footer-container">
        <div class="Footer-column">
            <a href="#" class="Footer-brand">
                <img src="{{ asset('assets/images/landings/footerLogo.svg') }}" alt="" class="Footer-brandImage">
            </a>

            <p class="Footer-copy">
                Copyright &COPY; {{ now()->year }} by AGS Inc.
            </p>
        </div>

        <div class="Footer-column">
            <h5 class="Footer-columnHeadline">Links</h5>
            <a href="{{ route('feed.list') }}" class="Footer-columnLink">Live Feed</a>
            <a href="{{ route('pop.report') }}" class="Footer-columnLink">POP Report</a>
        </div>

        <div class="Footer-column">
            <h5 class="Footer-columnHeadline">Reach Out</h5>
            <a href="tel:+1 929-209-3925"  class="Footer-columnLink">+1 929-209-3925</a>
            <a href="mailto:hey@agscard.com" class="Footer-columnLink">hey@agscard.com</a>
        </div>

        <div class="Footer-column Footer-socialLinks">
            <a href="https://www.instagram.com/agsgrading" class="Footer-socialLink">
                <img src="{{ asset('assets/images/landings/instagramIcon.svg') }}" alt=""
                     class="Footer-socialLinkImage">
            </a>

            <a href="https://twitter.com/agsgrading" class="Footer-socialLink">
                <img src="{{ asset('assets/images/landings/twitterIcon.svg') }}" alt="" class="Footer-socialLinkImage">
            </a>

            <a href="https://discord.gg/robograding" class="Footer-socialLink">
                <img src="{{ asset('assets/images/landings/discordIcon.svg') }}" alt="" class="Footer-socialLinkImage">
            </a>
        </div>
    </div>
</footer>

{{ $slot }}
