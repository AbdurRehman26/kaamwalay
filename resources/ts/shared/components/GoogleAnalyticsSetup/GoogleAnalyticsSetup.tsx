import { useEffect, useRef } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { useConfiguration } from '@shared/hooks/useConfiguration';

export function GoogleAnalyticsSetup() {
    const location = useLocation();
    const config = useConfiguration();
    const initialized = useRef(false);

    // Sending page view events to GA whenever the user navigates to a new route
    // This is used to track what pages are our current users viewing
    useEffect(() => {
        if (config.googleAnalyticsTrackingCode) {
            ReactGA.initialize(config.googleAnalyticsTrackingCode);
            initialized.current = true;
        }
    }, [config?.googleAnalyticsTrackingCode]);

    useEffect(() => {
        if (initialized.current) {
            ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
        }
    }, [location.pathname, location.search, config?.googleAnalyticsTrackingCode]);

    return null;
}
