import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GuestOnlyRoute from '@shared/components/GuestOnlyRoute';
import CreatePassword from '@auth/pages/Auth/CreatePassword';
import { Auth } from './Auth';

function App() {
    return (
        <BrowserRouter basename={'/auth'}>
            <Routes>
                <Route path={'/password/create'} element={GuestOnlyRoute(CreatePassword)} />
                <Route path={'/*'} element={<Auth />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
