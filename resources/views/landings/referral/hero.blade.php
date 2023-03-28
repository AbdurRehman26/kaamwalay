<x-layout.header />
<div class="referral-hero">
    <div class="referral-hero__container">
        <div class="referral-hero__overlay">
            <div class="container referral-hero__content">
                <p class="referral-hero__title-first">EARN MONEY <span class="referral-hero__title-second">WITH THE</span></p>
                <h1 class="referral-hero__title"> AGS referral Program</h1>
                <h2 class="referral-hero__subtitle">Refer your friends/followers and give them {{ config('robograding.feature_referral_discount_percentage') }}% OFF their first RoboGrading submission. You will get commission as soon as they pay. Not store credit, you’ll earn cold hard cash!</h2>
                <div data-atom="auth-button" data-class-name="referral-hero__auth-button referral-hero__auth-button__font-color" data-button-content="START EARNING">
                    {{-- JS runtime actions --}}
                </div>
            </div>
        </div>
    </div>
</div>
