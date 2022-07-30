import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import { trackPV } from '../utils/analyticsWrapper'

import Mtoolkit from '../pages/Mtoolkit';
import CheckList from '../pages/CheckList';

export default function MToolkitRoutes() {

    const location = useLocation();

    useEffect(() => {
        trackPV();
    }, [location]); // automatic pv tracking

    return (
        <Routes>
            <Route path="/" element={<Mtoolkit />}>
                <Route path="check-list" element={<CheckList />} />
            </Route>
        </Routes>
    )
}