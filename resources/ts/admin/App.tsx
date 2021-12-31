import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@shared/components/ProtectedRoute';
import { RolesEnum } from '@shared/constants/RolesEnum';
import { Admin } from './Admin';

function App() {
    return (
        <BrowserRouter basename={'/admin'}>
            <Routes>
                <Route path={'/*'} element={ProtectedRoute(Admin, { roles: RolesEnum.Admin })} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
