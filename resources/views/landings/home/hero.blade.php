<x-layout.header :transparent="true" :noShadow="true" />
<div class="Home-hero">
    <div class="Home-videoHolder Home-video--js">
        {{-- Mount video on runtime--}}
        <div class="Home-videoOverlay"></div>
    </div>

    <div class="Home-heroContent">
        <div class="container">
            <h1 class="Home-heroTitle" data-aos="fade-up" data-aos-easing="ease-in-out">The fastest, most accurate way to grade your cards.</h1>
            <h2 class="Home-heroSubtitle" data-aos="fade-up" data-aos-easing="ease-in-out" data-aos-delay="100">Get your cards graded with artificial intelligence.</h2>
            <div data-atom="submit-button" data-aos="fade-in" data-text-color="black" data-aos-easing="ease-in-out" data-aos-delay="200" data-button-content="Grade your cards">
                {{-- JS runtime actions --}}
            </div>
        </div>
    </div>
</div>

<script>
    (function () {
        var header = document.querySelector<HTMLDivElement>('.page__header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('page__header--scrolled');
            } else {
                header.classList.remove('page__header--scrolled');
            }
        }
    })();
</script>
