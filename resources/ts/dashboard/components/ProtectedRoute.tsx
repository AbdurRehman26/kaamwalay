import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function ProtectedRoute({ component: Component, ...restOfProps }: any) {
    const isAuthenticated = localStorage.getItem('userAuthData')
        ? JSON.parse(localStorage.getItem('userAuthData') as any).token?.length !== 0
        : false;
    return (
        <Route
            {...restOfProps}
            render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to="/signin" />)}
        />
    );
}

export default ProtectedRoute;
