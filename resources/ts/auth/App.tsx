import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleAnalyticsSetup } from '@shared/components/GoogleAnalyticsSetup';
import { Auth } from './Auth';

function App() {
    return (
        <BrowserRouter basename={'/auth'}>
            <GoogleAnalyticsSetup />
            <Routes>
                <Route path={'/*'} element={<Auth />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
