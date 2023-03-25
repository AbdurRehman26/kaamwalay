<x-layout.header />
<div class="partner-hero">
    <div class="container-fluid align-middle partner-hero__container">
        <div class="partner-hero__overlay">
            <div class="partner-hero__content">
                <p class="partner-hero__title-first">EARN MONEY <span class="partner-hero__title-second">WITH THE</span></p>
                <h1 class="partner-hero__title"> AGS Partner Program</h1>
                <h2 class="partner-hero__subtitle">Refer your friends/followers and give them {{ config('robograding.feature_referral_discount_percentage') }}% OFF their first RoboGrading submission.</h2>
                <h2 class="partner-hero__subtitle">You will get commission as soon as they pay. Not store credit, you’ll earn cold hard cash!</h2>
                <div data-atom="auth-button" data-class-name="partner-hero__auth-button" data-button-content="START EARNING">
                    {{-- JS runtime actions --}}
                </div>
            </div>
        </div>
    </div>
</div>
