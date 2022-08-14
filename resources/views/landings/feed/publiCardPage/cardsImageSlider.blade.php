<div class="container">
  <div class="swiper mySwiper2 ">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img src="{{ $card['image_path'] }}" alt="{{ $card['name'] }}" data-imagebox="gallery" />
      </div>
    </div>
  </div>
  <div class="swiper mySwiper">
    <div class="swiper-wrapper thumbNail">
      <div class="swiper-slide">
        <img src="{{ $card['image_path'] }}" alt="{{ $card['name'] }}" />
      </div>
    </div>
  </div>
</div>
