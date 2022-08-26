import { lazy, Suspense } from 'react';

const DoughnutChart = lazy(() => import('../components/core/DoughnutChartCore'));

export default function DoughnutChartLazy(props) {
    return <Suspense fallback={<>props.fallback</>}><DoughnutChart data={props.data} /></Suspense>;
}