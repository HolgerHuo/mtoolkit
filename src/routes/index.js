import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { trackPV } from '../utils/analyticsWrapper';

import Mtoolkit from '../pages/Mtoolkit';
import CheckList from '../pages/CheckList';
import NotFound from '../pages/NotFound';

export default function MToolkitRoutes() {

    const location = useLocation();

    useEffect(() => {
        trackPV();
    }, [location]); // automatic pv tracking

    return (
        <Routes>
            <Route path="/" element={<Mtoolkit />}>
                <Route path="check-list" element={<CheckList />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}