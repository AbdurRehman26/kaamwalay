<section class="authentication-view__certificate-image">
    <div class="container">
        <div class="authentication-view__certificate-image__image-div">
            <h1 class="authentication-view__certificate-image__number">
                {{ $certificate_number }}
            </h1>
            <a href="{{ asset('assets/images/landings/authentication/speedy-coa.jpeg') }}" class="glightbox">
                <img src="{{ asset('assets/images/landings/authentication/speedy-coa.jpeg') }}" alt="bonus" class="bonus-earnings__image-div__image">
            </a>

        </div>

        <div class="authentication-view__certificate__button">
            <a type="button" href="{{ route('authentication.index') }}" class="authentication-view__button">
                Verify Another Certificate
            </a>

        </div>

    </div>
</section>
