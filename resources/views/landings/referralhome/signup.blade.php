<section class="ReferralHome-signup">
    <img src="{{ asset('assets/images/landings/home/priceBackground.jpg') }}" alt="" class="ReferralHome-pricingBackground" />
    <div id="top" class="ReferralHome-main">
        <div class="ReferralHome-mainLeft">
            <div class="ReferralHome-referralName">
                <div class="ReferralHome-iconDiv">
                    <img src="{{ asset('assets/images/landings/referralhome/ags_branding.svg') }}" alt="" />
                </div>
                <div>
                    <span>Referral by {{ $referBy }} </span>
                </div>
            </div>
            <div>
                <h1 class="ReferralHome-sectionTitle">Sign Up to Claim <span> {{ config('robograding.feature_referral_discount_percentage') }}% OFF </span> Your First Submission</h1>
                <h2 class="ReferralHome-sectionSubtitle">You’re one step away from unbelievable savings. Sign up today and get {{ config('robograding.feature_referral_discount_percentage') }}% off* your fist submission.</h2>
                <h2 class="ReferralHome-sectionCaption">*Offer applies to the first {{ config('robograding.feature_referral_max_discount_items') }} cards in your submission.</h2>
            </div>
        </div>
        <div class="ReferralHome-mainRight">
            <div data-atom="auth-views" data-aos="fade-left" data-aos-delay="200" data-discount={{ config('robograding.feature_referral_discount_percentage') }} data-content="{{$referralCode}}">
                {{-- JS runtime actions --}}
            </div>
        </div>
    </div>
</section>
