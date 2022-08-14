@if($generated_images)
<section class="feed-view__images">
    <div class="container">
        <div class="feed-view__images__top-section">
            <div>
                <h4 class="feed-view__images__heading">Generated Images</h4>
            </div>
            <div class="feed-view__generated-images__buttons">
                <button class="feed-view__generated-images__buttons__front" onclick="frontButtonToggle()">Front</button>
                <button class="feed-view__generated-images__buttons__back" onclick="backButtonToggle()">Back</button>
            </div>
        </div>
        <div class="feed-view__images__cards-front">
            @foreach($generated_images['front'] as $front_image)
            <article class="feed-view__images__card">
                <img class="feed-view__images__image" src="{{ $front_image['output_image'] }}" data-imagebox="gallery" data-imagebox-caption="{{ $front_image['name'] }}">
                <p class="feed-view__images__caption">{{ $front_image['name'] }}</p>
            </article>
            @endforeach
        </div>
        <div class="feed-view__images__cards-back">
            @foreach($generated_images['back'] as $back_image)
            <article class="feed-view__images__card">
                <img class="feed-view__images__image" src="{{ $back_image['output_image'] }}" data-imagebox="gallery" data-imagebox-caption="{{ $back_image['name'] }}">
                <p class="feed-view__images__caption">{{ $back_image['name'] }}</p>
            </article>
            @endforeach
        </div>
    </div>
</section>
@endif
