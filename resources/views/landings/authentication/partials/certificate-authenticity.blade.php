<section class="authentication-view__certificate-image">
    <div class="container">
        <div class="authentication-view__certificate-image__image-div">
            <h1 class="authentication-view__certificate-image__number">
                {{ $certificate_number }}
            </h1>
            <img src="{{ asset('assets/images/landings/authentication/speedy-coa.jpeg') }}" alt="bonus" class="bonus-earnings__image-div__image">
{{--            <a href="{{ asset('assets/images/landings/authentication/speedy-coa.jpeg') }}" data-desc-position="top" data-description=".custom-desc1" class="glightbox">--}}
{{--                <div class="glightbox-desc custom-desc1">--}}
{{--                    <p class="authentication-view__certificate-image__number">{{$certificate_number}}</p>--}}
{{--                </div>--}}
{{--            </a>--}}
        </div>

        <div class="authentication-view__certificate__button">
            <a type="button" href="{{ route('authentication.index') }}" class="authentication-view__button">
                Verify Another Certificate
            </a>

        </div>

    </div>
</section>
