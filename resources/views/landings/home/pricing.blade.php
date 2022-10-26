<section class="Home-section Home-pricing">
    <img src="{{ asset('assets/images/landings/home/priceBackground.jpg') }}" alt=""
         class="Home-pricingBackground" />
    <div class="container Home-sectionContainer Home-sectionContainer--center-center">
        <div class="Home-sectionColumn Home-sectionColumn--half Home-sectionColumn--center-center" data-aos="fade"
            >
            <h4 class="Home-sectionContentCaption text-center">Service Levels</h4>
            <h3 class="Home-sectionContentHeadline text-center">Unbeatable Prices and Turnaround Times</h3>
        </div>

        <div class="Home-priceRange" data-atom="quantity-dependent-pricing-chips" data-content="{{json_encode($paymentPlanRanges)}}">
            {{-- JS runtime actions --}}
        </div>
        
    </div>
</section>
