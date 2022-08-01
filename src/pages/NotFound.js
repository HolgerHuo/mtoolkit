import { lazy, Suspense } from 'react';
import { Typography } from '@mui/material';

import './NotFound.css'

const ChromeDinoGame = lazy(() => import('react-chrome-dino'));

export default function NotFound() {
    return (
        <>
            <Typography variant="h5" component="h5" className='title center pm'>
                404 - Not found
            </Typography>
            <div className='center'>
                <p>呜呜~这篇未开发的土地仿佛被你发现了<br />不要摸小恐龙的尾巴哦~</p>
            </div>
            <Suspense fallback={<>小恐龙正在孵化中...</>}>
                <ChromeDinoGame />
            </Suspense>
        </>
    )
};