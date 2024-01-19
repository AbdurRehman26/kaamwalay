<section class="autograph-view__certificate-image">
    <div class="container">
        <div>
            <div class="autograph-view__certificate-image__image-div">
                <h1 class="autograph-view__certificate-image__number">
                    {{ $certificate_number }}
                </h1>
                <img src="{{ asset('assets/images/landings/autograph/speedy-coa.jpeg') }}" alt="bonus" class="bonus-earnings__image-div__image">
            </div>
        </div>

        <div class="feed-view__conclusion__button autograph-view__conclusion__button" data-atom="authentication-list-button" data-button-content="Verify Another Certificate">
            {{-- JS runtime actions --}}
        </div>
    </div>
</section>
