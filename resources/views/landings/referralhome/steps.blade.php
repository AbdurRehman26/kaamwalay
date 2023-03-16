<section class="ReferralHome-section ReferralHome-steps">
    <div class="container ReferralHome-sectionContainer ReferralHome-sectionContainer--center-center" data-aos="fade-up">
        <div class="ReferralHome-sectionColumn ReferralHome-sectionColumn--half ReferralHome-sectionColumn--center-center">
            <h4 class="ReferralHome-sectionContentCaptionSteps">How To Claim Your Discount</h4>
        </div>
    </div>

    <div class="container ReferralHome-sectionContainer ReferralHome-featuresGrid" data-aos="fade-up"data-aos-delay="100">
        <div class="ReferralHome-sectionColumn ReferralHome-sectionColumn--third">
            <div class="ReferralHome-featureColumnSteps">
                <img src="{{ asset('assets/images/landings/referralhome/stepone1.svg') }}" alt="" class="ReferralHome-featureIcon">
                <div class="Numbering-section">
                    <h3 class="Numbering">1</h3>
                    <h3 class="Numbering-title">SignUp</h3>
                    <h6 class="Numbering-subtitle">Sign up and we'll share a {{ config('robograding.feature_referral_discount_percentage') }}% OFF discount code with you.</h6>
                </div>
            </div>
        </div>

        <div class="ReferralHome-sectionColumn ReferralHome-sectionColumn--third">
            <div class="ReferralHome-featureColumnSteps">
                <img src="{{ asset('assets/images/landings/referralhome/steptwo2.svg') }}" alt="" class="ReferralHome-featureIcon">
                <div class="Numbering-section">
                    <h3 class="Numbering">2</h3>
                    <h3 class="Numbering-title">Create Submission</h3>
                    <h6 class="Numbering-subtitle">Start your submission and apply the {{ config('robograding.feature_referral_discount_percentage') }}% of discount.</h6>
                </div>
            </div>
        </div>

        <div class="ReferralHome-sectionColumn ReferralHome-sectionColumn--third">
            <div class="ReferralHome-featureColumnSteps">
                <img src="{{ asset('assets/images/landings/referralhome/stepthree03.svg') }}" alt="" class="ReferralHome-featureIcon">
                <div class="Numbering-section">
                    <h3 class="Numbering">3</h3>
                    <h3 class="Numbering-title">Save {{ config('robograding.feature_referral_discount_percentage') }}%</h3>
                    <h6 class="Numbering-subtitle">{{ config('robograding.feature_referral_discount_percentage') }}% will automatically be deducted from your first submission.</h6>
                </div>
            </div>
        </div>  
        <div class="container text-center">
            <button onclick="(function(){window.scrollTo(0, 0)})()" class="ReferralHome-button">Sign Up & Save</button> 
        </div>      
    </div>
</section>
