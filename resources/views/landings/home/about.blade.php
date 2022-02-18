<section class="Home-section Home-about">
    <div class="Home-sectionLayers">
        <img src="{{ asset('assets/images/landings/home/pattern02.jpg') }}" alt=""
             class="Home-sectionLayer Home-sectionLayer--topLeft" width="216" height="216">
        <img src="{{ asset('assets/images/landings/home/pattern01.jpg') }}" alt=""
             class="Home-sectionLayer Home-sectionLayer--bottomRight Home-sectionLayer--offset" width="670"
             height="420">
    </div>
    <div class="container Home-sectionContainer">
        <div class="Home-sectionColumn Home-sectionColumn--half">
            <a href="#" class="Home-sectionImageHolder">
                <img src="{{ asset('assets/images/landings/home/videoPoster.jpg') }}" alt="Video"
                     class="Home-sectionImage" />
                <div class="Home-sectionImagePlay">
                    <span class="material-icons">play_arrow</span>
                </div>
            </a>
        </div>
        <div class="Home-sectionColumn Home-sectionColumn--half">
            <h4 class="Home-sectionContentCaption">Meet Robograding</h4>
            <h3 class="Home-sectionContentHeadline">The world's first & only, fully A.I. card grading platform.</h3>
            <p class="Home-sectionContentText">Other grading companies are inaccurate, expensive and extremely slow
                because humans are doing the grading. With our technology, are able to grade cards 10x faster, and
                more accurately than the other guys.</p>
            <div class="atoms--submit-button">
                {{-- JS runtime actions --}}
            </div>
        </div>
    </div>
</section>
