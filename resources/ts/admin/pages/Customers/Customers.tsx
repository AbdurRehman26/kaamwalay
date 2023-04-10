import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CustomerView } from './CustomerView';
import { CustomersList } from './CustomersList';

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: Customers
 * @date: 23.12.2021
 * @time: 21:40
 */
export function Customers() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/customers/list'} replace />} />
            <Route path={'list'} element={<CustomersList />} />
            <Route path={'/:id/view/:tab'} element={<CustomerView />} />
        </Routes>
    );
}

export default Customers;
