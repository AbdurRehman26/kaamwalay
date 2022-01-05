import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';
import CustomersListPage from './CustomersListPage';

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: Customers
 * @date: 23.12.2021
 * @time: 21:40
 */
export function Customers() {
    return (
        <Routes>
            <Route path={'/customers'} element={<Navigate to={'/customers/list'} replace />} />
            <Route path={'/customers/list'} element={<CustomersListPage />} />
        </Routes>
    );
}

export default Customers;
