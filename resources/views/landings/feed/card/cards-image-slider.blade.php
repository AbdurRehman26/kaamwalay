<div class="container">
  <div class="swiper mySwiper2 ">
    <div class="swiper-wrapper">
      @foreach($slabbed_images as $slabbed_image)
      <div class="swiper-slide">
        <img src="{{ $slabbed_image }}" alt="{{ $card['name'] }}" />
      </div>
      @endforeach
    </div>
  </div>
  <div class="swiper mySwiper">
    <div class="swiper-wrapper thumbNail">
      @foreach($slabbed_images as $slabbed_image)
      <div class="swiper-slide">
        <img src="{{ $slabbed_image }}" alt="{{ $card['name'] }}" />
      </div>
      @endforeach
    </div>
  </div>
</div>
