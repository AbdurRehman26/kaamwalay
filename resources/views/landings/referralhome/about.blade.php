<section class="ReferralHome-section ReferralHome-about">
    <div class="container ReferralHome-sectionContainer">
        <div class="ReferralHome-sectionColumn ReferralHome-sectionColumn--half">
            <div style="position: relative;">
                <video width="710" height="410">
                    <source src="{{ asset('assets/images/landings/referralhome/home.mp4') }}" type="video/mp4">
                </video>
                <img style="height: 410; width: 710" src="{{ asset('assets/images/landings/referralhome/videoPoster.png') }}"
                     class="Home-sectionImage" />
                <div onclick="playVideo()" class="ReferralHome-sectionImagePlay">
                    <span id="icon" class="material-icons">play_arrow</span>
                </div>
            </div>
        </div>
        <div class="ReferralHome-sectionColumn ReferralHome-sectionColumn--half">
            <h4 class="container ReferralHome-sectionContentCaption" data-aos="fade-left">WHY CHOOSE ROBOGRADING?</h4>
            <h3 class="ReferralHome-sectionContentHeadline" data-aos="fade-left">If you want accurate, transparent grades there is no alternative.</h3>
            <p class="ReferralHome-sectionContentText" data-aos="fade-left"data-aos-delay="100">AGS is the first card-grading company that uses 100% Artificial Intelligence to grade your cards. You’ll get consistent, accurate, and unbiased grades every time. Combine that with the fastest turnaround in the industry and the most affordable prices, you’ll find that AGS delivers an unrivaled grading experience for every collector.
            </p>
            <div class="container text-left">
                <button onclick="(function(){window.scrollTo(0, 0)})()" class="ReferralHome-button">Sign Up</button>
            </div>
        </div>
    </div>
</section>
