import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { Outlet, useRoutes, Navigate } from 'react-router-dom';

import AuthRoute from './auth/index.jsx'

const Layout = ({ children }) => (
    <>
      {/* <Header /> */}
      <div className="flex">
        {/* <Sidebar /> */}
        <div className="w-[100%] mt-[10px] h-[calc(100vh-100px)]">
          {children}
        </div>
      </div>
    </>
  );
  
  const SimpleLayout = ({ children }) => (
        <>
          {/* <Header /> */}
        <div className="w-[100%] mt-[10px] h-[calc(100vh-100px)]">
          {children}
        </div>
      </>
    );



const AppRoute = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <SimpleLayout><Outlet /></SimpleLayout>,
      children: [
        { path: 'auth/*', element: <AuthRoute /> },
      ]
    },


  ]);

  return element;
};

export default AppRoute;