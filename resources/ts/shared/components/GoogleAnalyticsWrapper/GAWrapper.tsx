import React, { PropsWithChildren, useEffect } from 'react';
import ReactGA from 'react-ga';
import { useHistory } from 'react-router-dom';

type GAWrapperProps = {
    basename: string;
    children: PropsWithChildren<any>;
};

export function GAWrapper(props: GAWrapperProps) {
    const history = useHistory();
    const { basename } = props;

    ReactGA.initialize('UA-205552225-1');
    // Sending page view events to GA whenever the user navigates to a new route
    // This is used to track what pages are our current users viewing
    useEffect(() => {
        return history.listen((location) => {
            ReactGA.pageview(basename + location.pathname + location.search);
        });
    }, [history, basename]);

    return <>{props.children}</>;
}
