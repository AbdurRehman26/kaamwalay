import { Navigate, Route, Routes } from 'react-router-dom';
import PromoCodesList from './PromoCodesList/PromoCodesList';

export function PromoCodes() {
    return (
        <Routes>
            <Route path={''} element={<Navigate to={'/promo-codes/all/list'} replace />} />
            <Route path={'/:tab/list'} element={<PromoCodesList />} />
        </Routes>
    );
}
