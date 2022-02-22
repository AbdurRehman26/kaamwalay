<x-layout.header :transparent="true" :noShadow="true" />
<div class="Home-hero">
    <div class="Home-videoHolder Home-video--js">
        {{-- Mount video on runtime--}}
        <div class="Home-videoOverlay"></div>
    </div>

    <div class="Home-heroContent">
        <div class="container">
            <h1 class="Home-heroTitle">The fastest, most accurate way to grade your cards.</h1>
            <h2 class="Home-heroSubtitle">Get your cards graded with artificial intelligence.</h2>
            <a href="/dashboard/submissions/new" class="Home-buttonCta">Grade your cards</a>
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
