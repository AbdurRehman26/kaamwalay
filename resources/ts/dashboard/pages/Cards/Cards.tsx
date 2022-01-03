import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ListCards } from './ListCards';
import { ViewCard } from './ViewCard';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: Cards
 * @date: 10.08.2021
 * @time: 01:24
 */
export function Cards() {
    return (
        <Routes>
            <Route path={''} element={<ListCards />} />
            <Route path={'/:id/view'} element={<ViewCard />} />
        </Routes>
    );
}

export default Cards;
