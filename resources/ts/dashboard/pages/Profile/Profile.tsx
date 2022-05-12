import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { BasicInfo } from './BasicInfo';

export function Profile() {
    return (
        <Routes>
            <Route path={''} element={<BasicInfo />} />
        </Routes>
    );
}

export default Profile;
