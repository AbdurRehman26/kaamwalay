<section class="Home-section Home-details">
    <div class="Home-sectionLayers">
        <img src="{{ asset('assets/images/landings/home/pattern02.jpg') }}" alt=""
             class="Home-sectionLayer Home-sectionLayer--topRight" width="216" height="216">
        <img src="{{ asset('assets/images/landings/home/pattern01.jpg') }}" alt=""
             class="Home-sectionLayer Home-sectionLayer--bottomLeft Home-sectionLayer--offset" width="670"
             height="420">
    </div>
    <div class="container Home-sectionContainer">
        <div class="Home-sectionColumn Home-sectionColumn--half" data-aos="fade">
            <h4 class="Home-sectionContentCaption">Transparent grading</h4>
            <h3 class="Home-sectionContentHeadline">Get a detailed grade breakdown.</h3>
            <p class="Home-sectionContentText">When you grade your card with us, you will also get a breakdown of
                your grade. This will help you understand your grade way better than traditional grading. You'll
                know the exact score your card received for centering, surface, corners & edges for the front and
                back of your card.</p>
            <div data-atom="submit-button" data-button-content="Start a submission">
                    {{-- JS runtime actions --}}
            </div>
        </div>
        <div class="Home-sectionColumn Home-sectionColumn--half">
            <a href="{{ asset('assets/images/landings/home/detailsPoster.jpg') }}" data-type="image" data-gallery="details" data-effect="zoom"
               class="Home-sectionImageHolder glightbox" data-aos="fade-left">
                <img src="{{ asset('assets/images/landings/home/detailsPoster.jpg') }}" alt="Detail"
                     class="Home-sectionImage" />
            </a>
        </div>
    </div>
</section>
