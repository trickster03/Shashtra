import React from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

import AuthRoute from './auth/index.jsx';
import Home from '../views/Home.jsx'; // Import the Home component

const AppRoute = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <Outlet />, // Use Outlet to render child routes
      children: [
        { path: 'auth/*', element: <AuthRoute /> },
        { path: '/', element: <Home /> }, // Add route for Home
      ]
    },
  ]);
   
  return element;
};

export default AppRoute;