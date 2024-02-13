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
            <h4 class="Home-sectionContentCaption" data-aos="fade-left">Meet Kaamwalay</h4>
            <h3 class="Home-sectionContentHeadline" data-aos="fade-left">Find best skilled service professionals near you.</h3>

            <div data-atom="services-multi-select" data-aos="fade-left" data-aos-delay="200">
                {{-- JS runtime actions --}}
            </div>
            
            <div class="mt4" data-atom="submit-button" data-button-content="Search Provider">
                {{-- JS runtime actions --}}
            </div>
        </div>

        <div class="Home-sectionColumn Home-sectionColumn--half">
            <a
                href="https://www.youtube.com/watch?v=kykG32LWahg"
                data-type="video"
                data-effect="zoom"
                class="Home-sectionImageHolder glightbox" data-aos="fade-right">
                <img src="{{ asset('assets/images/landings/home/videoPoster.jpg') }}" alt="Video"
                     class="Home-sectionImage" />
                <div class="Home-sectionImagePlay">
                    <span class="material-icons">play_arrow</span>
                </div>
            </a>
        </div>
    </div>
</section>
