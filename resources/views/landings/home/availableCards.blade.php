<section class="Home-section Home-availableCards">
    <div class="container Home-sectionContainer Home-sectionContainer--center-center">
        <div class="Home-sectionColumn Home-sectionColumn--half Home-sectionColumn--center-center" data-aos="fade">
            <h4 class="Home-sectionContentCaption text-center">Currently accepting:</h4>
            <h3 class="Home-sectionContentHeadline text-center">
                @foreach($categories->take(4) as $category)
                    @if ($loop->last)
                        {{ $category->name }}
                    @else
                        {{ $category->name }},
                    @endif
                @endforeach
                & More!
            </h3>
            <p class="Home-sectionContentText text-center">You can include any card from the categories listed below in your submission.
                We support a wide array of TCG and Sports Cards, and we’re always adding more!</p>
        </div>
    </div>

    <div class="container Home-sectionContainer">
        <div class="Home-availableCardsImages">
            @foreach($categories as $category)
                <div class="Home-availableCardsColumn" data-aos="fade" data-aos-delay="100">
                    <img src="{{ $category->image_url }}" alt="{{ $category->name }}" class="Home-availableCardsImage" />
                </div>
            @endforeach
        </div>
    </div>
</section>
