import React, { useMemo } from 'react';
import { Outlet } from "react-router-dom";
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import NavFrame from '../layouts/Navbar'
import ServiceWorkerNotification from '../components/ServiceWorkerNotification'

import './Mtoolkit.css';


function Mtoolkit() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <app className="Mtoolkit">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ServiceWorkerNotification />
        <NavFrame>
          <Outlet />
        </NavFrame>
      </ThemeProvider>
    </app>
  );
}

export default Mtoolkit;
