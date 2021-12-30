import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { BasicInfo } from './BasicInfo';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: Cards
 * @date: 10.08.2021
 * @time: 01:24
 */
export function Profile() {
    return (
        <Routes>
            <Route path={''} element={<BasicInfo />} />
        </Routes>
    );
}

export default Profile;
