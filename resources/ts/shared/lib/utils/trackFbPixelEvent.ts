import { FacebookPixelEvents } from '../../constants/FacebookPixelEvents';

function trackFbPixelEvent(event: FacebookPixelEvents, data?: any) {
    if (window.fbq) {
        window.fbq('track', event, data);
    }
}

export default trackFbPixelEvent;
