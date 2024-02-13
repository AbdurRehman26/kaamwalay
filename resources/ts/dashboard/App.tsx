import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { CouponCode } from './pages/Referee';

function App() {
    return (
        <BrowserRouter basename={'/dashboard'}>
            <Routes>
                <Route path={'/referee-coupon-code'} element={<CouponCode />} />
                <Route path={'/*'} element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
