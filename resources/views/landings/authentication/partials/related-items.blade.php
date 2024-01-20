<section class="authentication-view__related-items">
    <div class="container">
        <div class="bonus-earnings__heading-div">
            <p class="bonus-earnings__heading-div__small-text authentication-view__related-items__heading" data-aos="fade">Related Items</p>
        </div>
        <div class="bonus-earnings__images-div authentication-view__related-items__images-div" data-aos="fade">

            @foreach($related_items as $related_item)

                <div class="authentication-view__related-items__image-div">
                    <div class="authentication-view__related-items__image">
                        <div><span class="material-icons">verified_user</span></div>
                        <a href="{{ route('authentication.view', [$related_item['certificate_number']]) }}" class="glightbox">
                            <img src="{{ $related_item['image_url'] }}" alt="bonus" class="bonus-earnings__image-div__image">
                        </a>
                    </div>
                    <div class="authentication-view__related-items__content">
                        <a href="{{ route('authentication.view', [$related_item['certificate_number']]) }}">
                            <h1>{{ $related_item['long_name'] }}</h1>
                            <p class="authentication-view__related-items__certificate-number">{{ $related_item['certificate_number'] }}</p>
                        </a>

                    </div>
                </div>

            @endforeach

        </div>
    </div>
</section>
