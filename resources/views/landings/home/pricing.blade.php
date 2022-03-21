<section class="Home-section Home-pricing">
    <img src="{{ asset('assets/images/landings/home/priceBackground.jpg') }}" alt=""
         class="Home-pricingBackground" />
    <div class="container Home-sectionContainer Home-sectionContainer--center-center">
        <div class="Home-sectionColumn Home-sectionColumn--half Home-sectionColumn--center-center" data-aos="fade"
             data-aos-easing="ease-in-out">
            <h4 class="Home-sectionContentCaption text-center">Service Levels</h4>
            <h3 class="Home-sectionContentHeadline text-center">Unbeatable Prices and Turnaround Times</h3>
        </div>

        <div class="Home-pricesHolder">
            <div class="Home-prices Home-prices--js" data-aos="fade-up" data-aos-easing="ease-in-out">
                @foreach($services as $service)
                    <div class="slide-holder">
                        <div class="Home-priceColumn">
                            <h4 class="Home-priceHeadline">${{ $service->price }} <small>/Card</small></h4>
                            <ul class="Home-priceFeatures">
                                <li class="Home-priceFeature">
                                    <p class="Home-priceFeatureText">
                                        <img src="{{asset('assets/images/landings/home/carIcon.svg')}}" alt=""
                                             class="Home-priceFeatureIcon" />
                                        <b>{{ $service->turnaround }}</b> Turnaround
                                    </p>
                                </li>
                                <li class="Home-priceFeature">
                                    <p class="Home-priceFeatureText">
                                        <img src="{{asset('assets/images/landings/home/moneyIcon.svg')}}" alt=""
                                             class="Home-priceFeatureIcon" />
                                        Up to <b>${{ $service->max_protection_amount }}</b> Insurance
                                    </p>
                                </li>
                                <li class="Home-priceFeature">
                                    <p class="Home-priceFeatureText">
                                        <img src="{{asset('assets/images/landings/home/verifiedIcon.svg')}}" alt=""
                                             class="Home-priceFeatureIcon" />
                                        Grade Certificate
                                    </p>
                                </li>
                                <li class="Home-priceFeature">
                                    <p class="Home-priceFeatureText">
                                        <img src="{{asset('assets/images/landings/home/detailedIcon.svg')}}" alt=""
                                             class="Home-priceFeatureIcon" />
                                        Detailed Grade Breakdown
                                    </p>
                                </li>
                                <li class="Home-priceFeature">
                                    <p class="Home-priceFeatureText">
                                        <img src="{{asset('assets/images/landings/home/slabIcon.svg')}}" alt=""
                                             class="Home-priceFeatureIcon" />
                                        AGS Slab
                                    </p>
                                </li>
                            </ul>                            
                            <div data-atom="submit-button" data-plan="{{$service->id}}" data-text-color="white" data-button-content="Select & start submission" data-margin="true">
                                {{-- JS runtime actions --}}
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</section>
