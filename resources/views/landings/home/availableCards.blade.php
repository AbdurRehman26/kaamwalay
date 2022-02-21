<section class="Home-section Home-availableCards">
    <div class="container Home-sectionContainer Home-sectionContainer--center-center">
        <div class="Home-sectionColumn Home-sectionColumn--half Home-sectionColumn--center-center" data-aos="fade" data-aos-easing="ease-in-out">
            <h4 class="Home-sectionContentCaption text-center">Currently accepting:</h4>
            <h3 class="Home-sectionContentHeadline text-center">Pokemon, MetaZoo, Dragon Ball Super & Yu-Gi-Oh!</h3>
            <p class="Home-sectionContentText text-center">You can include any card from these four categories in
                your submission. We will be adding more TCG and sports cards soon.</p>
        </div>
    </div>

    <div class="container Home-sectionContainer">
        <div class="Home-availableCardsImages">
            @foreach($categories as $category)
                <div class="Home-availableCardsColumn" data-aos="fade" data-aos-easing="ease-in-out" data-aos-delay="100">
                    <img src="{{ $category->image_url }}" alt="{{ $category->name }}" class="Home-availableCardsImage" />
                </div>
            @endforeach
        </div>
    </div>
</section>
