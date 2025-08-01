import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
