import React, { PropsWithChildren, useEffect } from 'react';
import ReactGA from 'react-ga';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '@dashboard/redux/hooks';

export function GAWrapper(props: PropsWithChildren<any>) {
    const history = useHistory();
    const userID = useAppSelector((state) => state.authentication?.user?.id);

    ReactGA.initialize('UA-205552225-1', {
        gaOptions: {
            userId: String(userID),
        },
    });

    // Sending page view events to GA whenever the user navigates to a new route
    // This is used to track what pages are our current users viewing
    useEffect(() => {
        return history.listen((location) => {
            ReactGA.pageview(location.pathname + location.search);
        });
    }, [history]);

    return <>{props.children}</>;
}
