import { FacebookPixelEvents } from '../../constants/FacebookPixelEvents';

export function trackFacebookPixelEvent(event: FacebookPixelEvents, data?: any) {
    if (window.fbq) {
        window.fbq('track', event, data);
    }
}
