<section class="ReferralHome-signup">
    <img src="{{ asset('assets/images/landings/home/priceBackground.jpg') }}" alt=""
         class="ReferralHome-pricingBackground" />
    <div id="top" class="ReferralHome-main">
        <div class="ReferralHome-mainLeft">
            <div class="ReferralHome-referralName">
                    <img src="{{ asset('assets/images/landings/referralhome/announcement.png') }}" alt=""/>
                    <span>Referral by {{ $referBy }}</span>
            </div>
            <div>
                <h1 class="ReferralHome-sectionTitle">Sign Up to Claim <span> 30% OFF </span> Your First Submission</h1>
                <h2 class="ReferralHome-sectionSubtitle">You’re one step away from unbelievable savings.</h2>
            </div>
        </div>
        <div class="ReferralHome-mainRight">
            <div data-atom="auth-views" data-aos="fade-left"data-aos-delay="200" data-content="{{$referralCode}}">
                {{-- JS runtime actions --}}
            </div>
        </div>
    </div>
</section>
