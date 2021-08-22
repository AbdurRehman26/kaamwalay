import React, { PropsWithChildren, useEffect } from 'react';
import ReactGA from 'react-ga';
import { useHistory } from 'react-router-dom';

ReactGA.initialize('UA-205552225-1');
export function GAWrapper(props: PropsWithChildren<any>) {
    const history = useHistory();
    useEffect(() => {
        return history.listen((location) => {
            ReactGA.pageview(location.pathname + location.search);
        });
    }, [history]);
    return <>{props.children}</>;
}
