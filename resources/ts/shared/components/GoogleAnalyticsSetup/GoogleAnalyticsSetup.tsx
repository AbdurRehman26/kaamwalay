import { useEffect } from 'react';
import ReactGA from 'react-ga';
import { useHistory } from 'react-router-dom';
import { useConfiguration } from '@shared/hooks/useConfiguration';

export function GoogleAnalyticsSetup() {
    const history = useHistory();
    const config = useConfiguration();

    // Sending page view events to GA whenever the user navigates to a new route
    // This is used to track what pages are our current users viewing
    useEffect(() => {
        if (config.googleAnalyticsTrackingCode) {
            ReactGA.initialize(config.googleAnalyticsTrackingCode);
            ReactGA.plugin.require('ecommerce');
            ReactGA.pageview(window.location.pathname + window.location.search);
            return history.listen(() => {
                ReactGA.pageview(window.location.pathname + window.location.search);
            });
        }
    }, [history, config?.googleAnalyticsTrackingCode]);

    return null;
}
