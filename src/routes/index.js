import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { trackPV } from '../utils/analyticsWrapper';

import Mtoolkit from '../pages/Mtoolkit';
import Entry from '../pages/Entry';
import About from '../pages/About';
import CheckList from '../pages/CheckList';
import NotFound from '../pages/NotFound';
import StiUI from '../pages/StiUI';

export default function MToolkitRoutes() {

    const location = useLocation();

    useEffect(() => {
        trackPV();
    }, [location]); // automatic pv tracking

    return (
        <Routes>
            <Route path="/" element={<Mtoolkit />}>
                <Route index element={<Entry />} />
                <Route path="about" element={<About />} />
                <Route path="check-list" element={<CheckList />} />
                <Route path="sti-ui" element={<StiUI />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}