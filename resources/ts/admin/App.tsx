import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import ProtectedRoute from '@shared/components/ProtectedRoute';
import { RolesEnum } from '@shared/constants/RolesEnum';
import { Admin } from './Admin';

function App() {
    return (
        <BrowserRouter basename={'/admin'}>
            <Switch>
                <ProtectedRoute roles={RolesEnum.Admin} path={'/'} component={Admin} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
