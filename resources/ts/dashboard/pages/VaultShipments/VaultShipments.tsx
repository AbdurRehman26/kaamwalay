import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@shared/components/ProtectedRoute';
import { ListVaultShipments } from './ListVaultShipments';

export function VaultShipments() {
    return (
        <Routes>
            <Route path={''} element={ProtectedRoute(ListVaultShipments)} />
        </Routes>
    );
}
