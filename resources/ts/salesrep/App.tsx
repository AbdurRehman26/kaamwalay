import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@shared/components/ProtectedRoute';
import { RolesEnum } from '@shared/constants/RolesEnum';
import { SalesRep } from './SalesRep';

function App() {
    return (
        <BrowserRouter basename={'/salesrep'}>
            <Routes>
                <Route path={'/*'} element={ProtectedRoute(SalesRep, { roles: RolesEnum.Admin })} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
