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
            <a
                href="https://www.youtube.com/watch?v=Yz_u_F6n4SU"
                data-type="video"
                data-effect="zoom"
                class="Home-sectionImageHolder glightbox" data-aos="fade-right" data-aos-easing="ease-in-out">
                <img src="{{ asset('assets/images/landings/home/videoPoster.jpg') }}" alt="Video"
                     class="Home-sectionImage" />
                <div class="Home-sectionImagePlay">
                    <span class="material-icons">play_arrow</span>
                </div>
            </a>
        </div>
        <div class="Home-sectionColumn Home-sectionColumn--half">
            <h4 class="Home-sectionContentCaption" data-aos="fade-left" data-aos-easing="ease-in-out">Meet Robograding</h4>
            <h3 class="Home-sectionContentHeadline" data-aos="fade-left" data-aos-easing="ease-in-out">The world's first & only, fully A.I. card grading platform.</h3>
            <p class="Home-sectionContentText" data-aos="fade-left" data-aos-easing="ease-in-out" data-aos-delay="100">Other grading companies are inaccurate, expensive and extremely slow
                because humans are doing the grading. With our technology, are able to grade cards 10x faster, and
                more accurately than the other guys.</p>

            <div data-atom="submit-button" data-text-color="white" data-aos="fade-left" data-aos-easing="ease-in-out" data-aos-delay="200" data-button-content="Start a submission">
                {{-- JS runtime actions --}}
            </div>
        </div>
    </div>
</section>
