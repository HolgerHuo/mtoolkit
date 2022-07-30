import React from 'react';
import { Outlet } from "react-router-dom";

import NavFrame from '../layouts/Navbar'
import ServiceWorkerNotification from '../components/ServiceWorkerNotification'

import './Mtoolkit.css';


function Mtoolkit() {

  return (
    <app className="Mtoolkit">
      <ServiceWorkerNotification />
      <NavFrame>
        <Outlet />
      </NavFrame>
    </app>
  );
}

export default Mtoolkit;
