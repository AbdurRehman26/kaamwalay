import { Navigate, Route, Routes } from 'react-router-dom';
import { VaultShipmentList } from './VaultShipmentList';

export function VaultShipment() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/vault-storage/shipments/list'} replace />} />
            <Route path={'/:tab/list'} element={<VaultShipmentList />} />
        </Routes>
    );
}
