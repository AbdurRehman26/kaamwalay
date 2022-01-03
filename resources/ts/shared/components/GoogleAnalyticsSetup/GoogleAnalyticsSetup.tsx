import { useEffect, useRef } from 'react';
import ReactGA from 'react-ga';
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
            ReactGA.plugin.require('ecommerce');
            initialized.current = true;
        }
    }, [config?.googleAnalyticsTrackingCode]);

    useEffect(() => {
        if (initialized.current) {
            ReactGA.pageview(location.pathname + location.search);
        }
    }, [location.pathname, location.search, config?.googleAnalyticsTrackingCode]);

    return null;
}
