<section class="authentication-view__related-items">
    <div class="container">
        <div class="bonus-earnings__heading-div">
            <p class="authentication-view__related-items__heading" data-aos="fade">Related Items</p>
        </div>
        <div class="bonus-earnings__images-div authentication-view__related-items__images-div" data-aos="fade">
            @foreach($related_items as $related_item)
            <a class="authentication-view__related-items__image-div" href="{{ route('authentication.view', [$related_item['certificate_number']]) }}">
                <div>
                    <div class="authentication-view__related-items__image image">
                        <div><span class="material-icons">verified_user</span></div>
                        <img src="{{ $related_item['image_url'] }}" alt="bonus" class="bonus-earnings__image-div__image">
                    </div>
                    <div class="authentication-view__related-items__content">
                        <h1 class="long-name">{{ $related_item['long_name'] }}</h1>
                        <p class="authentication-view__related-items__certificate-number">{{ $related_item['certificate_number'] }}</p>
                    </div>
                </div>
            </a>
            @endforeach
        </div>
    </div>
</section>
