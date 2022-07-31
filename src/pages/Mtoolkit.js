import React, { useMemo } from 'react';
import { Outlet } from "react-router-dom";
import { Container, CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Navbar from '../layouts/Navbar';
import ServiceWorkerNotification from '../components/ServiceWorkerNotification';

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
    <Container className="Mtoolkit">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ServiceWorkerNotification />
        <Navbar />
        <Container className="app" maxWidth='sm'>
          <Outlet />
        </Container>
      </ThemeProvider>
    </Container>
  );
}

export default Mtoolkit;
